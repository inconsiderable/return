import { IonChip, IonIcon, IonText } from '@ionic/react';
import {
  copyOutline,
  locationOutline,
  returnDownBackOutline,
} from 'ionicons/icons';
import { useClipboard } from '../../useCases/useClipboard';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../utils/appContext';
import { shortenB64 } from '../../utils/compat';

export const KeyAbbrev = ({ value }: { value: string }) => {
  const abbrevKey = shortenB64(value);

  return <code>{abbrevKey}</code>;
};

const KeyChip = ({ value }: { value: string }) => {
  const { copyToClipboard } = useClipboard();

  const { colorScheme, requestProfile, profile } = useContext(AppContext);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (value) {
        requestProfile(value);
      }
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, requestProfile]);

  const pubKeyRanking = profile(value)?.ranking;
  const pubKeyTracking = profile(value)?.imbalance;
  const cathcment = profile(value)?.focale;

  return (
    <>
      <span>
        <IonChip onClick={() => copyToClipboard(value)}>
          <KeyAbbrev value={value} />
          <IonIcon icon={copyOutline} color="primary"></IonIcon>
        </IonChip>
        {cathcment && (
          <IonChip
            onClick={(e) => {
              window.open(`https://plus.codes/${cathcment}`);
            }}
          >
            <IonIcon
              style={{
                marginLeft: '-4px',
              }}
              icon={locationOutline}
              color="primary"
            ></IonIcon>
          </IonChip>
        )}
      </span>

      {pubKeyRanking !== undefined && (
        <IonText color="primary">
          <p>
            {pubKeyRanking !== undefined && (
              <>
                <strong>Ranking: </strong>
                <i>{Number((pubKeyRanking / 1) * 100).toFixed(2)}%</i>
              </>
            )}
            <br />
            {pubKeyTracking !== undefined && (
              <>
                <strong>Tracking: </strong>
                <i>{pubKeyTracking} </i>
                <IonIcon icon={returnDownBackOutline} color="primary" />
              </>
            )}
          </p>
        </IonText>
      )}
    </>
  );
};

export default KeyChip;
