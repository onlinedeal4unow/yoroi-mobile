import _ from 'lodash'
import moment from 'moment'
import {Alert} from 'react-native'

import api from './api'
import ownAddresses from './mockData/addresses.json'


const _updateTransactions = (rawTransactions) => ({
  type: 'Update transactions',
  path: ['transactions', 'data'],
  payload: rawTransactions,
  reducer: (state, payload) => payload,
})

const _startFetch = () => ({
  type: 'Fetch transaction history',
  path: ['transactions', 'isFetching'],
  payload: null,
  reducer: (state, payload) => true,
})

const _endFetch = () => ({
  type: 'Finished fetching transaction history',
  path: ['transactions', 'isFetching'],
  payload: null,
  reducer: (state, payload) => false,
})

export const updateHistory = () => async (dispatch) => {
  dispatch(_startFetch())

  const ts = moment('2018-01-01T09:44:39.757Z')
  try {
    const response = await api.fetchNewTxHistory(ts, ownAddresses)
    dispatch(_updateTransactions(_.keyBy(response, (tx) => tx.hash)))
  } catch {
    Alert.alert('Network error', 'Could not fetch transaction history', [{text: 'OK'}])
  } finally {
    dispatch(_endFetch())
  }
}