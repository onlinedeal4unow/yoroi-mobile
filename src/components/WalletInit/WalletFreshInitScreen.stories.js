// @flow

import React from 'react'

import {storiesOf} from '@storybook/react-native'

import WalletFreshInitScreen from './WalletFreshInitScreen'

import {action} from '@storybook/addon-actions'

import {NavigationContext} from '@react-navigation/core'

// mockup navigation prop
// some stories may require specific navigation parameters to work; these should
// be specified locally in the story file
const route = {
  params: {},
}

const navigation = {
  navigate: action('navigate'),
  setParams: action('setParams'),
  setOptions: action('setOptions'),
  addListener: action('addListener'),
}

type NavigationProps = {navigation: typeof navigation, route: typeof route}

export const withNavigationProps = (story: () => Node, {navigation}: {navigation: typeof navigation}) => (
  <NavigationContext.Provider value={navigation}>{story()}</NavigationContext.Provider>
)

storiesOf('WalletFreshInitScreen', module)
  .addDecorator(withNavigationProps)
  .add('Default', ({navigation}) => <WalletFreshInitScreen navigation={navigation} />)
