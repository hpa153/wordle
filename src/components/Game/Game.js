import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors, CLEAR, ENTER, colorsToEmoji } from '../../constants';
import {words} from '../words';
import Keyboard from '../Keyboard';
import EndScreen from '../EndScreen';
import styles from './styles';
import { copyArray, getDayOfYear } from '../utils';

const NUMBER_OF_TRIES = 6;


export default function Game() {
  // AsyncStorage.removeItem("@game");
  const today = getDayOfYear();
  const date = new Date();
  const year = date.getFullYear();
  const dayKey = `day-${today}-${year}`;
  const [word, setWord] = useState(words[today]);
  // console.log(word);
  const letters = word.split("");
  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES)
    .fill(new Array(letters.length).fill("")));
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow, curCol]);

  useEffect(() => {
    if (loaded) {
      cacheState();
    }
  }, [rows, curRow, curCol, gameState]);

  useEffect(() => {
    readState();
  }, []);

  // Handle key presses
  const onKeyPressed = (key) => {
    if (gameState !== "playing") {
      return;
    }

    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;

      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = "";
        setRows(updatedRows);
        setCurCol(prevCol);
      }

      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }

      return;
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  }

  // Set active cell
  const isActive = (row, col) => {
    return row === curRow && col === curCol;
  }

  // Get background for cells after user input
  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if (row >= curRow) {
      return colors.black;
    } else {
      if (letter === letters[col]) {
        return colors.primary;
      } else if (letters.includes(letter)) {
        return colors.secondary;
      } else {
        return colors.darkgrey;
      }
    }
  }

  // Get color to apply for key caps
  const getCapColors = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color));
  };

  const greenCaps = getCapColors(colors.primary);
  const yellowCaps = getCapColors(colors.secondary);
  const greyCaps = getCapColors(colors.darkgrey);

  // Check if player won or lose
  const checkGameState = () => {
    if (checkWin()) {
      setGameState("won");
    } else if (checkLose()) {
      setGameState("lost");
    }
  };

  // Check if player won
  const checkWin = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter === letters[i]);
  }

  // Check if player lost
  const checkLose = () => {
    return !checkWin() && curRow === rows.length;
  }

  // Cache all states of the game
  const cacheState = async () => {
    const todayData = {
      rows,
      curRow,
      curCol,
      gameState,
    }

    try {
      let existingStateString = await AsyncStorage.getItem("@game");
      let existingState = existingStateString ? JSON.parse(existingStateString) : {};
      existingState[dayKey] = todayData;

      // Parse to string because async storage requires string
      const dataString = JSON.stringify(existingState);

      await AsyncStorage.setItem('@game', dataString);
    } catch (error) {
      console.log("Unable to cache states: " + error);
    }
  }

  // Read states from async storage
  const readState = async () => {
    const dataString = await AsyncStorage.getItem("@game");

    try {
      const data = JSON.parse(dataString);
      const day = data[dayKey];
      setRows(day.rows);
      setCurRow(day.curRow);
      setCurCol(day.curCol);
      setGameState(day.gameState);
    } catch (error) {
      console.log("Unable to parse data: " + error);
    }
    setLoaded(true);
  }

  if (!loaded) {
    return <ActivityIndicator />;
  }

  if (gameState !== "playing") {
    return (<EndScreen won={gameState === "won"} rows={rows} getCellBGColor={getCellBGColor} />);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.map}>
        {
          rows.map((row, i) => (
            <View key={`row-${i}`} style={styles.row}>
              {
                row.map((cell, j) => (
                  <View
                    key={`cell-${i}-${j}`}
                    style={[
                      styles.cell,
                      {
                        borderColor: isActive(i, j) ?
                          colors.lightgrey :
                          colors.darkgrey,
                        backgroundColor: getCellBGColor(i, j),
                      },
                    ]}
                  >
                    <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                  </View>))
              }
            </View>
          ))
        }
      </View>
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </SafeAreaView>
  );
}
