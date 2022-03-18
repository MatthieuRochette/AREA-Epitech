import { Job, Service } from '../../global/result';
import { getJobs, getServices, deleteJob } from '../../global/utils';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { Title, Button as IconButton } from 'react-native-paper';
import ServicesCSS from './styles';

const Services: FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const retrievedJobs = await getJobs()
        setJobs(retrievedJobs)
      } catch {(e: Error) => console.error(e)}
    })()
  }, [])

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      const retrievedJobs = await getJobs()
      setJobs(retrievedJobs)
      setRefreshing(false)
    } catch {(err: Error) => console.log(err)}
  }, []);

  const sendDelete = async (id: string) => {
    try {
      await deleteJob(id)
      const retrievedJobs = await getJobs()
      setJobs(retrievedJobs)
    } catch {(e: Error) => console.error(e)}
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
      />
      }
    >
      <View>
        {
          jobs.map((job, i) => (
            <View
              key={i}
              style={ServicesCSS.jobCard}
            >
              <View
                style={ServicesCSS.actionCard}
              >
                <Title>ACTION</Title>

                <Text>{job.action.service}</Text>

                <Text>{job.action.name}</Text>
              </View>

              <View
                style={ServicesCSS.reactionsCard}
              >
                <Title>REACTIONS</Title>
                {
                  job.reactions.map && job.reactions.map((reaction, j) => (
                    <View key={j}>
                      <Text>{reaction.service}</Text>

                      <Text>{reaction.name}</Text>
                    </View>
                  ))
                }
              </View>

              <View
                style={ServicesCSS.triggerCard}
              >
                <Title>TRIGGER</Title>
                <Text>{job.trigger._type}</Text>
                {
                  job.trigger._type === ('interval') ?
                    <Text>{`Every ${job.trigger.params.days ? job.trigger.params.days + ' Day(s),' : ''} ${job.trigger.params.hours} Hour(s), ${job.trigger.params.minutes} Minute(s)`}</Text>
                  : job.trigger._type === ('date') ?
                    <Text>{new Date(job.trigger.params.run_date).toDateString()}</Text>
                  :
                    <Text>{`Every day at ${job.trigger.params.hour} Hour(s), ${job.trigger.params.minute} Minute(s)`}</Text>
                }
              </View>

              <IconButton
                icon='delete'
                onPress={() => sendDelete(job.id)}
              />
            </View>
          ))
        }
      </View>
    </ScrollView>
  )
}

export default Services;