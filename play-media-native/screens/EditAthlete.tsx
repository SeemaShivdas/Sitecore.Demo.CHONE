import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-native-paper';

import { BottomActions } from '../components/BottomActions/BottomActions';
import { EDIT_ATHLETE_DISCARD_MESSAGE, FIELD_OVERRIDES_ATHLETE } from '../constants/athlete';
import { ContentItemFields } from '../features/ContentItemFields/ContentItemFields';
import { Screen } from '../features/Screen/Screen';
import { useContentItems } from '../hooks/useContentItems/useContentItems';
import { Athlete } from '../interfaces/athlete';
import { RootStackParamList } from '../interfaces/navigators';
import { styles } from '../theme/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'EditAthlete'>;

export const EditAthleteScreen = ({ navigation, route }: Props) => {
  const [stateKey] = useState(route?.params?.stateKey);
  const { contentItems } = useContentItems();

  const athlete = (contentItems[stateKey] ?? null) as unknown as Athlete;
  const headerTitle = athlete?.athleteName || 'Untitled athlete';

  const handleReview = useCallback(() => {
    navigation.navigate('ReviewAthlete', {
      isNew: false,
      stateKey,
      title: headerTitle,
    });
  }, [headerTitle, navigation, stateKey]);

  const handleDiscard = useCallback(() => {
    navigation.push('DiscardChanges', {
      message: EDIT_ATHLETE_DISCARD_MESSAGE,
      stateKey,
      redirectRoute: 'MainTabs',
      title: headerTitle,
      subtitle: 'Discard athlete changes?',
    });
  }, [headerTitle, navigation, stateKey]);

  useEffect(() => {
    navigation.setParams({
      title: headerTitle,
    });
  }, [headerTitle, navigation]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (event) => {
        // Prevent default behavior of leaving the screen
        //
        event.preventDefault();

        navigation.push('DiscardChanges', {
          message: EDIT_ATHLETE_DISCARD_MESSAGE,
          stateKey,
          redirectRoute: 'MainTabs',
          title: headerTitle,
          subtitle: 'Discard athlete changes?',
        });
      });

      // Make sure to remove the listener
      // Otherwise, it BLOCKS GOING BACK to MainTabs from a nested screen discard action
      //
      return () => {
        unsubscribe();
      };
    }, [headerTitle, navigation, stateKey])
  );

  return (
    <Screen>
      <ContentItemFields
        initialRoute="EditAthlete"
        overrides={FIELD_OVERRIDES_ATHLETE}
        stateKey={stateKey}
        headerTitle={headerTitle}
      />
      <BottomActions>
        <Button
          mode="outlined"
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={handleDiscard}
        >
          Discard
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={handleReview}
        >
          Review
        </Button>
      </BottomActions>
    </Screen>
  );
};
