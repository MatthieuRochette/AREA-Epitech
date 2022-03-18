import { Action, Job, Reaction, Service, Trigger } from '../../global/result';
import { getJobs, getServices, ModalContent } from '../../global/utils';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View, Button, RefreshControl } from 'react-native';
import { Caption, Title, Button as IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import _ from 'lodash/fp';
import ActionsCSS from './styles';
import ShortID from 'shortid';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { createJob } from './api';

const Actions: FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [actionServices, setActionServices] = useState<Service[]>([])
  const [reactionServices, setReactionServices] = useState<Service[]>([])
  const [pickedValue, setPickedValue] = useState<string>()
  const [pickedReaction, setPickedReaction] = useState<string>()
  const [pickedReactionService, setPickedReactionService] = useState<string>()
  const [pickedTrigger, setPickedTrigger] = useState<string>()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState<ModalContent>()
  const [days, setDays] = useState<string>()
  const [time, setTime] = useState<Date>(new Date(0))
  const [date, setDate] = useState<Date>(new Date())
  const [displayTimePicker, setDisplayTimePicker] = useState(false)
  const [paramsReaction, setParamsReaction] = useState<string[]>([])
  const [paramsReactionKeys, setParamsReactionKeys] = useState<string[]>([])
  const [paramsAction, setParamsAction] = useState<string[]>([])
  const [paramsActionKeys, setParamsActionKeys] = useState<string[]>([])
  const [disabled, setDisabled] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const updateReactionParams = (index: number, p: string, key: string) => {
    const newParams = [...paramsReaction]
    newParams[index] = p
    const newParamsKeys = [...paramsReactionKeys]
    newParamsKeys[index] = key
    setParamsReaction(newParams)
    setParamsReactionKeys(newParamsKeys)
 }
 
  const updateActionParams = (index: number, p: string, key: string) => {
    const newParams = [...paramsAction]
    newParams[index] = p
    const newParamsKeys = [...paramsActionKeys]
    newParamsKeys[index] = key
    setParamsAction(newParams)
    setParamsActionKeys(newParamsKeys)
  }

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      const retrievedServices = await getServices()
      setServices(retrievedServices)
      setRefreshing(false)
    } catch {(err: Error) => console.error(err)}
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const retrievedServices = await getServices()
        setServices(retrievedServices)
      } catch {(e: Error) => console.error(e)}
    })()
  }, [])

  useEffect(() => {
    (async () => {
      setActionServices(_.remove<Service>((s) => s.actions.length === 0)(services))
      setReactionServices(_.remove<Service>((s) => s.reactions.length === 0)(services))
      setDate((prevState) => {
        const newDate = new Date(prevState)
        newDate.setDate(newDate.getDate() + 1)
        return(newDate)
      })
    })()
  }, [services])

  useEffect(() => {
    if (pickedReaction && pickedReaction !== 'null' && pickedTrigger && pickedTrigger !== 'null' && paramsReaction)
      setDisabled(false)
    else
      setDisabled(true)
  }, [pickedReaction, pickedTrigger, paramsReaction])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {
        actionServices.map(
          (service, i) => {
            return (
              <View
                key={`${i}:${service.name}`}
                style={ActionsCSS.serviceCard}
              >
                <Title>{service.name}</Title>
                  {
                    service.actions.map((action, index) => (
                      <View
                        key={`${action.name}!${index}`}
                        style={ActionsCSS.actionCard}
                      >
                        <Text>{action.name}</Text>
                        <IconButton
                          icon='plus'
                          onPress={() => {
                            setModalContent({ title: action.name, description: action.description, params: action.params, service: service.name })
                            setModalVisible(true)
                          }}
                        />
                      </View>
                    ))
                  }
              </View>
            )
          }
        )
      }
      <View>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          onBackButtonPress={() => setModalVisible(false)}
        >
          <View
            style={ActionsCSS.modal}
          >
            <Title>{modalContent?.title}</Title>
            <Caption>{modalContent?.description}</Caption>
            {
              modalContent?.params && Object.keys(modalContent.params).map((key, i) => (
                <View
                  key={`${i}:${key}`}
                >
                  <Text>{`${key} => ${modalContent.params[key]}`}</Text>
                  <TextInput
                    placeholder={modalContent.params[key]}
                    value={paramsAction[i]}
                    onChangeText={(text) => updateActionParams(i, text, key)}
                  />
                </View>
              ))
            }
            <Picker
              style={ActionsCSS.picker}
              itemStyle={ActionsCSS.itemStyle}
              selectedValue={pickedValue}
              onValueChange={(item: string) => {
                if (item !== undefined) {
                  const itemSplit = item.split('ç')
                  setPickedReaction(itemSplit[0])
                  setPickedReactionService(itemSplit[1])
                  setPickedValue(item)
                }
              }}
            >
              <Picker.Item
                label='Select a reaction'
                value='null'
              />
              {
                reactionServices.map((service) => (
                  service.reactions.map((reaction) => (
                    <Picker.Item
                      key={`${reaction.name}${reaction.description}`}
                      label={`${reaction.name} => ${reaction.description}`}
                      value={reaction.name + 'ç' + service.name}
                    />
                  ))
                ))
              }
            </Picker>
            {
              reactionServices.map((service) => (
                service.reactions.map((reaction) => (
                  reaction.params && Object.keys(reaction.params).map((key, i) => (
                    reaction.name === pickedReaction ?
                      (
                        <View
                          key={`${i}:${key}`}
                        >
                          <Text>{`${key} => ${reaction.params[key]}`}</Text>
                          <TextInput
                            placeholder={reaction.params[key]}
                            value={paramsReaction[i]}
                            onChangeText={(text) => updateReactionParams(i, text, key)}
                          />
                        </View>
                      )
                    :
                      (<View></View>)
                  ))
                ))
              ))
            }
            <Picker
              style={ActionsCSS.picker}
              itemStyle={ActionsCSS.itemStyle}
              selectedValue={pickedTrigger}
              onValueChange={(item) => setPickedTrigger(item)}
            >
              <Picker.Item
                label='Select a trigger'
                value='null'
              />
              <Picker.Item
                label='Interval'
                value='interval'
              />
              <Picker.Item
                label='Date'
                value='date'
              />
              <Picker.Item
                label='Scheduled task'
                value='cron'
              />
            </Picker>
            {
              pickedTrigger && pickedTrigger === 'interval' ?
                (
                  <View style={ActionsCSS.intervalCard}>
                    <View style={ActionsCSS.daysInput}>
                      <Text>Days</Text>
                      <TextInput
                        value={days}
                        placeholder='Days'
                        onChangeText={(d) => setDays(d)}
                        keyboardType='numeric'
                      />
                    </View>
                    <View style={ActionsCSS.timeInput}>
                      <Text>{`Hours : Minutes = ${time.getHours()} : ${time.getMinutes()}`}</Text>
                      <Button
                        title='Change Hours and Minutes'
                        onPress={() => {
                          setDisplayTimePicker(true)
                        }}
                      />
                    </View>
                    {
                      displayTimePicker && (
                        <RNDateTimePicker
                          mode='time'
                          display='spinner'
                          value={time}
                          is24Hour={true}
                          onChange={(e, t) => {
                            const currentTime = t || time
                            setDisplayTimePicker(false)
                            setTime(currentTime)
                          }}
                        />
                      )
                    }
                  </View>
                )
              : pickedTrigger && pickedTrigger === 'date' ?
                (
                  <View style={ActionsCSS.timeInput}>
                    <Text>{`Date (YY-MM-DD): ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}</Text>
                    <Button
                      title='Set Date'
                      onPress={() => setDisplayTimePicker(true)}
                    />
                    {
                      displayTimePicker && (
                        <RNDateTimePicker
                          mode='date'
                          value={date}
                          onChange={(e, d) => {
                            const currentDate = d || date
                            setDisplayTimePicker(false)
                            setDate(currentDate)
                          }}
                        />
                      )
                    }
                  </View>
                )
              : pickedTrigger && pickedTrigger !== 'null' ?
                (
                  <View style={ActionsCSS.intervalCard}>
                    <View style={ActionsCSS.timeInput}>
                        <Text>{`Hours : Minutes = ${time.getHours()} : ${time.getMinutes()}`}</Text>
                        <Button
                          title='Change Hours and Minutes'
                          onPress={() => {
                            setDisplayTimePicker(true)
                          }}
                        />
                      </View>
                      {
                        displayTimePicker && (
                          <RNDateTimePicker
                            mode='time'
                            display='spinner'
                            value={time}
                            is24Hour={true}
                            onChange={(e, t) => {
                              const currentTime = t || time
                              setDisplayTimePicker(false)
                              setTime(currentTime)
                            }}
                          />
                        )
                      }
                  </View>
                )
              : (<View></View>)
            }
            <Button
              title='SUBMIT'
              disabled={disabled}
              onPress={() => {
                jobBuilder(days, date, time, pickedTrigger, pickedReaction!, pickedReactionService!, modalContent!.title, modalContent!.service, paramsReactionKeys, paramsReaction, paramsAction, paramsActionKeys)
                setModalVisible(false)
              }}
            />
          </View> 
        </Modal>
      </View>
    </ScrollView>
  )
};

const jobBuilder = async (days: string | undefined, date: Date, time: Date, triggerType: string, reactionName: string, reactionService: string, actionName: string, actionService: string, reactionParamsKeys: string[], reactionParams: string[], actionParams: string[], actionParamsKeys: string[]) => {
  const rp = reactionParamsKeys.reduce((obj, itm, i) => {
    obj[itm] = reactionParams[i]
    return obj
  }, {})

  const ap = actionParamsKeys.reduce((obj, itm, i) => {
    obj[itm] = actionParams[i]
    return obj
  }, {})

  let tp
  if (triggerType === 'interval')
    tp = {
      days,
      hours: time.getHours().toString(),
      minutes: time.getMinutes().toString(),
    }
  else if (triggerType === 'date')
    tp = {
      run_date: date.getTime().toString()
    }
  else
    tp = {
      hour: time.getHours().toString(),
      minute: time.getMinutes().toString(),
    }

  const job: Job = {
    id: ShortID.generate(),
    action: {
      service: actionService,
      name: actionName,
      params: ap
    },
    reactions: [{
      service: reactionService,
      name: reactionName,
      params: rp
    }],
    trigger: {
      _type: triggerType,
      params: tp
    }
  }
  await createJob(job).then().catch((e) => console.error(e));
}

export default Actions;