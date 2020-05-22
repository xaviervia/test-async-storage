import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { View, Text } from 'react-native'

export const App = () => {
  const [successfullyStored, setSuccessfullyStored] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    AsyncStorage.setItem('@storage_Key', 'value')
      .then(() => setSuccessfullyStored(true))
      .catch(() => setSuccessfullyStored(false))
  }, [])

  return (
    <View>
      <Text>Test AsyncStorage:</Text>
      {successfullyStored === true && <Text>Stored successfully!</Text>}
      {successfullyStored === false && <Text>Failed to store :(</Text>}
    </View>
  )
}
