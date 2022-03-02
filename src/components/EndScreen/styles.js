import { StyleSheet } from "react-native";
import { colors } from "../../constants";

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  title: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 20,
    color: colors.lightgrey,
    textAlign: 'center',
    marginVertical: 15,
  },
  numberContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  number: {
    fontSize: 30,
    color: colors.lightgrey,
  },
  label: {
    color: colors.lightgrey,
  },
  guessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  guesses: {
    width: '100%', 
    padding: 20,
    justifyContent: 'flex-start',
  },
  guessRow: {
    alignSelf: 'stretch',
    width: '50%',
    backgroundColor: colors.grey,
    padding: 5,
  },
  position: {
    color: colors.lightgrey,
  },
  amount: {
    fontWeight: 'bold',
    color: colors.darkgrey,
    marginLeft: 5,
    padding: 5,
    paddingRight: 0,
    backgroundColor: colors.grey,
  },
  timerContainer: {
    alignItems: 'center',
    flex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 30,
    margin: 10,
  },
  buttonText: {
    color: colors.lightgrey,
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default styles;
