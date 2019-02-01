// Import React
import React from 'react';

// Import Spectacle Core tags
import {
  Deck,
  Heading,
  ListItem,
  List,
  Slide,
  Text,
} from 'spectacle';

// Import theme
import createTheme from 'spectacle/lib/themes/default';
import SimpleCamApp from './apps/SimpleCamApp';
import CamEffectApp from './apps/CamEffectApp';
import ConferenceApp from './apps/ConferenceApp';

// Require CSS
require('normalize.css');

const theme = createTheme(
  {
    primary: 'white',
    secondary: '#1F2022',
    tertiary: '#03A9FC',
    quaternary: '#CECECE',
  },
  {
    primary: 'Montserrat',
    secondary: 'Helvetica',
  }
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        transition={['zoom', 'slide']}
        transitionDuration={500}
        theme={theme}
      >
        <Slide transition={['zoom']} bgColor="primary">
          <Heading size={2} fit caps lineHeight={2} textColor="secondary">
            Demonstrações de WebRTC
          </Heading>
          <Text margin="10px 0 0" textColor="tertiary" size={1}>
            Por: <strong>Marcell Guilherme C. da Silva</strong>,
            <br/>Desenvolvedor.
          </Text>
          <Text>
            <small>01/02/2019</small>
          </Text>
        </Slide>
        <Slide transition={['fade']} bgColor="tertiary">
          <Heading size={1} textColor="secondary">
            O que é WebRTC?
          </Heading>
          <Text>
            É a tecnologia que permite a captura e troca de dados
            entre aplicações web.
          </Text>
        </Slide>
        <Slide transition={['fade']} bgColor="primary" textColor="tertiary">
          <Heading size={6} textColor="secondary" caps>
            Algumas possibilidades
          </Heading>
          <List>
            <ListItem>Manipulação de microfone e câmera</ListItem>
            <ListItem>Compartilhamento de tela</ListItem>
            <ListItem>Players de áudio</ListItem>
            <ListItem>Comunicação multimídia ponta a ponta</ListItem>
          </List>
        </Slide>
        <Slide transition={['fade']} bgColor="primary" textColor="tertiary">
          <Heading size={6} textColor="secondary" caps>
            Aplicações conhecidas
          </Heading>
          <List>
            <ListItem>WhatsApp</ListItem>
            <ListItem>Skype</ListItem>
            <ListItem>Hangouts</ListItem>
            <ListItem>Facebook</ListItem>
            <ListItem>Evolux</ListItem>
          </List>
        </Slide>
        <Slide transition={['fade']} bgColor="secondary" textColor="primary">
          <Heading size={6} textColor="primary" caps>
            Exemplo: capturando vídeo
            <SimpleCamApp/>
          </Heading>
        </Slide>
        <Slide transition={['fade']} bgColor="secondary" textColor="primary">
          <Heading size={6} textColor="primary" caps>
            Exemplo: filtros
            <CamEffectApp/>
          </Heading>
        </Slide>
        <Slide transition={['fade']} bgColor="secondary" textColor="primary">
          <Heading size={6} textColor="primary" caps>
            Exemplo: conferência ("Vertinho")
            <ConferenceApp/>
          </Heading>
        </Slide>
      </Deck>
    );
  }
}
