import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DOURADO = '#c9a45c';
const ALTURA_TOPO = 78;

const destaques = [
  {
    icone: 'folder-open-outline',
    titulo: 'Diversos Projetos',
    texto: 'Encontre plantas para casas pequenas, médias e grandes.',
  },
  {
    icone: 'people-outline',
    titulo: 'Profissionais Especializados',
    texto: 'Encontre arquitetos e profissionais para desenvolver seu projeto.',
  },
  {
    icone: 'ribbon-outline',
    titulo: 'Profissionais Certificados',
    texto:
      'Conecte-se com profissionais experientes para criar projetos e espaços únicos.',
  },
];

export default function Home() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const largo = width >= 900;

  const navegar = (rota) => {
    router.push(rota);
  };

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <StatusBar barStyle="light-content" />

      {/* Cabeçalho */}
      <View
        style={[
          styles.topo,
          largo ? styles.topoLargo : styles.topoEstreito,
        ]}
      >
        <Pressable onPress={() => navegar('/')}>
          <Image
            source={require('../../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>

        <View style={[styles.menu, !largo && styles.menuEstreito]}>
          <Pressable style={styles.itemAtivo} onPress={() => navegar('/')}>
            <Text style={styles.textoAtivo}>Início</Text>
          </Pressable>

          <Pressable style={styles.item} onPress={() => navegar('/planta')}>
            <Text style={styles.textoItem}>Plantas</Text>
          </Pressable>

          <Pressable
            style={styles.item}
            onPress={() => navegar('/profissionais')}
          >
            <Text style={styles.textoItem}>Profissionais</Text>
          </Pressable>

          <Pressable style={styles.item} onPress={() => navegar('/sobre')}>
            <Text style={styles.textoItem}>Sobre Nós</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.perfil, !largo && styles.perfilEstreito]}
          onPress={() => navegar('/login')}
        >
          <Ionicons name="person-circle-outline" size={42} color={DOURADO} />
        </Pressable>
      </View>

      {/* Hero */}
      <ImageBackground
        source={require('../../assets/images/fundo-casa.png')}
        style={[styles.fundo, { minHeight: Math.max(height - ALTURA_TOPO, 640) }]}
        imageStyle={styles.imagemFundo}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.hero}>
          <View style={[styles.textos, largo && styles.textosLargo]}>
            <Text style={[styles.titulo, largo && styles.tituloLargo]}>
              PLANEJE.{'\n'}
              PROJETE.{'\n'}
              <Text style={styles.destaque}>REALIZE.</Text>
            </Text>

            <Text style={styles.descricao}>
              Encontre as melhores plantas e profissionais para transformar seu
              sonho em realidade.
            </Text>

            <View style={styles.botoes}>
              <Pressable
                style={styles.botaoCriar}
                onPress={() => navegar('/cadastro')}
              >
                <Text style={styles.textoBotaoCriar}>Crie sua Conta</Text>
              </Pressable>

              <Pressable
                style={styles.botaoLogar}
                onPress={() => navegar('/login')}
              >
                <Text style={styles.textoBotaoLogar}>Entre em sua Conta</Text>
              </Pressable>
            </View>
          </View>

          {/* Cards de destaque */}
          <View style={[styles.cards, largo && styles.cardsLargo]}>
            {destaques.map((d) => (
              <View key={d.titulo} style={[styles.card, largo && styles.cardLargo]}>
                <Ionicons name={d.icone} size={30} color={DOURADO} />
                <View style={styles.cardTextos}>
                  <Text style={styles.tituloCard}>{d.titulo}</Text>
                  <Text style={styles.textoCard}>{d.texto}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },

  conteudo: {
    flexGrow: 1,
  },

  // Cabeçalho
  topo: {
    backgroundColor: '#0d0d0d',
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
    paddingHorizontal: 24,
  },

  topoLargo: {
    height: ALTURA_TOPO,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 140,
  },

  topoEstreito: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
  },

  logo: {
    width: 110,
    height: 60,
  },

  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  menuEstreito: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },

  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  itemAtivo: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6b5a36',
    backgroundColor: '#1c1a14',
  },

  textoItem: {
    color: '#ffffff',
    fontSize: 14,
  },

  textoAtivo: {
    color: DOURADO,
    fontSize: 14,
  },

  perfil: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  perfilEstreito: {
    position: 'absolute',
    right: 20,
    top: 40,
  },

  // Hero
  fundo: {
    width: '100%',
    backgroundColor: '#000000',
  },

  imagemFundo: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  hero: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },

  textos: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  textosLargo: {
    paddingHorizontal: 150,
  },

  titulo: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 50,
  },

  tituloLargo: {
    fontSize: 64,
    lineHeight: 62,
  },

  destaque: {
    color: DOURADO,
  },

  descricao: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 29,
    marginTop: 26,
    marginBottom: 28,
    maxWidth: 360,
  },

  botoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },

  botaoCriar: {
    backgroundColor: DOURADO,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 6,
  },

  textoBotaoCriar: {
    color: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 14,
  },

  botaoLogar: {
    backgroundColor: 'rgba(15, 15, 15, 0.85)',
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 6,
  },

  textoBotaoLogar: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Cards
  cards: {
    paddingHorizontal: 24,
    gap: 14,
  },

  cardsLargo: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
    maxWidth: 1190,
    alignSelf: 'center',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    backgroundColor: 'rgba(12, 12, 12, 0.88)',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 24,
  },

  cardLargo: {
    flex: 1,
  },

  cardTextos: {
    flex: 1,
  },

  tituloCard: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  textoCard: {
    color: '#b5b5b5',
    fontSize: 12,
    lineHeight: 18,
  },
});