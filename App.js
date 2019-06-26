import {createStackNavigator, createAppContainer} from 'react-navigation';

import HomeScreen from './src/main';
import ResultScreen from './src/result';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen,navigationOptions: { header: null }},
  Result: {screen: ResultScreen},
});

const App = createAppContainer(MainNavigator);

export default App;
