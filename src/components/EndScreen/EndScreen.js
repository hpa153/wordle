import { useState, useEffect } from 'react';
import { Text, View, Pressable, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors, colorsToEmoji } from '../../constants';
import styles from './styles';

const Records = ({ number, label }) => (
  <View style={styles.numberContainer}>
    <Text style={styles.number}>{number}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const GuessDistributionLine = ({ position, amount, percentage }) => (
  <View style={styles.guessContainer}>
    <Text style={styles.position}>{position}</Text>
    <Text style={styles.amount}>{amount}</Text>
    <View style={[styles.guessRow, { width: `${percentage}%` }]}></View>
  </View>
);

const GuessDistribution = ({distribution}) => {
  if (!distribution) {
    return null;
  }

  const sum = distribution.reduce((total, dist) => dist + total, 0);

  return (
    <>
      <Text style={styles.subTitle}>GUESS DISTRIBUTION</Text>
      <View style={styles.guesses}>
        {
          distribution.map((dist, index) => (
            <GuessDistributionLine key={index} position={index + 1} amount={dist} percentage={dist / sum * 100} />
          ))
        }
        
      </View>
    </>
  )
}

export default function EndScreen({ won, rows, getCellBGColor }) {
  const [secondsTillTomorrow, setsecondsTillTomorrow] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [distribution, setDistribution] = useState([]);

  useEffect(() => {
    readState();
  }, []);

  useEffect(() => {
    const updateTime= () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      setsecondsTillTomorrow((tomorrow - now) / 1000)
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSceconds = () => {
    const getHours = Math.floor(secondsTillTomorrow / (60 * 60));
    const getMinutes = Math.floor((secondsTillTomorrow % (60 * 60)) / 60);
    const getSeconds = Math.floor(secondsTillTomorrow % 60);
    const hours = getHours < 10 ? `0${getHours}` : getHours;
    const minutes = getMinutes < 10 ? `0${getMinutes}` : getMinutes;
    const seconds = getSeconds < 10 ? `0${getSeconds}` : getSeconds;
    return `${hours}:${minutes}:${seconds}`;
  };

  // Share score
  const shareScore = () => {
    // Map through rows and return map with colors
    const sharedMap = rows.map((row, i) => row
      .map((cell, j) => colorsToEmoji[getCellBGColor(i, j)])
      .join(""))
      .filter((row) => row)
      .join("\n");

    Clipboard.setString(`Played with Phuong Anh Hoang \n${sharedMap}`);
    Alert.alert("Copied!", "Share your score on social media");
  };

  // Read states from async storage
  const readState = async () => {
    const dataString = await AsyncStorage.getItem("@game");
    let data;
    try {
      data = JSON.parse(dataString);
      console.log(data);
    } catch (error) {
      console.log("Unable to parse data: " + error);
    }
    
    // Get played
    const keys = Object.keys(data);

    // Get wins
    const values = Object.values(data);
    const numOfWins = values.filter(game => game.gameState !== "lose").length;
    console.log(numOfWins)

    // Get current streak
    let _curStreak = 0;
    let _maxStreak = 0;
    let prevDay = 0;

    keys.forEach((key) => {
      const day = parseInt(key.split("-")[1]);

      if (data[key].gameState !== "lose" && _curStreak === 0) {
        ++_curStreak;
      } else if (data[key].gameState !== "lose" && prevDay + 1 === day) {
        ++_curStreak;
      } else {
        _curStreak = won ? 1 : 0;
      }

      if (_curStreak > _maxStreak) {
        _maxStreak = _curStreak;
      }

      prevDay = day;
    });

    let _distribution = [0, 0, 0, 0, 0, 0];
    values.map((game) => {
      if (game.gameState !== "lose") {
        const tries = game.rows.filter(row => row[0]).length;
        _distribution[tries - 1] = _distribution[tries - 1] + 1;
      }
    })

    setPlayed(keys.length)
    setWinRate(Math.floor(numOfWins / keys.length * 100));
    setCurStreak(_curStreak);
    setMaxStreak(_maxStreak);
    setDistribution(_distribution);
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{won ? "Congrats" : "Try again tomorrow"}</Text>
      <Text style={styles.subTitle}>STATISTICS</Text>
      <View style={styles.container}>
        <Records number={played} label={"Played"} />
        <Records number={winRate} label={"Win %"} />
        <Records number={curStreak} label={"Cur streak"} />
        <Records number={maxStreak} label={"Max streak"} />
      </View>
      
      <GuessDistribution distribution={distribution} />

      <View style={styles.container}>
        <View style={styles.timerContainer}>
          <Text style={styles.label}>Next Wordle</Text>
          <Text style={styles.number}>{formatSceconds()}</Text>
        </View>
        <Pressable style={styles.button} onPress={shareScore}><Text style={styles.buttonText}>Share</Text></Pressable>
      </View>
    </View>
  );
}
