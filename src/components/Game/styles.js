import { StyleSheet } from "react-native";
import { colors } from "../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    marginBottom: '5%',
  },
  map: {
    alignSelf: 'stretch',
    padding: '5%',
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 70,
    margin: 3,
    borderWidth: 3,
    borderColor: colors.darkgrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default styles;
