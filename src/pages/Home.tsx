import { IonContent, IonHeader, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ApiRTC Ionic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">ApiRTC Ionic</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRow>
          <IonText>
            <p>
              Welcome on this ionic ApiRTC tutorial. Please follow the instructions on the README.md file.
            </p>
            <p>
              You will found two uses cases in this application:
            </p>
            <ul>
              <li>a <b>conference use case</b></li>
              <li>a P2P use case</li>
            </ul>
            <p>
              You can switch between the two use cases by clicking on the tabs at the bottom of the screen.
            </p>
            <p>
              We higly recommend to use the conference use case, as it will enable you to have P2P communication but also communication with several paratcipants in the room.
            </p>
          </IonText>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Home;
