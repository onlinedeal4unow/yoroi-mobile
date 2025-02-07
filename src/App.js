// @flow

import React, {useEffect} from 'react'
import {AppState, Platform} from 'react-native'
import 'intl'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {enableScreens} from 'react-native-screens'
import RNBootSplash from 'react-native-bootsplash'

import AppNavigator from './AppNavigator'
import {useDispatch} from 'react-redux'
import {initApp} from './actions'

enableScreens()

const useInitializeApp = () => {
  const dispatch = useDispatch()
  useEffect(() => dispatch(initApp()), [dispatch])
}

const useHideScreenInAppSwitcher = () => {
  const appStateRef = React.useRef(AppState.currentState)

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string): void => {
      if (Platform.OS !== 'ios') return

      const isFocused = (appState: ?string) => appState?.match(/active/)
      const isBlurred = (appState: ?string) => appState?.match(/inactive|background/)

      if (isBlurred(appStateRef.current) && isFocused(nextAppState)) RNBootSplash.hide({fade: true})
      if (isFocused(appStateRef.current) && isBlurred(nextAppState)) RNBootSplash.show({fade: true})

      appStateRef.current = nextAppState
    }

    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])
}

const App = () => {
  useHideScreenInAppSwitcher()
  useInitializeApp()

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  )
}

export default App
