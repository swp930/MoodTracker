/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Todos from './Todos'
import PushEx from './PushEx'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
//AppRegistry.registerComponent(appName, () => Todos);
//AppRegistry.registerComponent(appName, () => PushEx);
