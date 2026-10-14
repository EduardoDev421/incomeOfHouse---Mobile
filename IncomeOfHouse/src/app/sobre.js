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

const ESTATISTICAS = [
  { icone: 'people-outline', numero: '+500', texto: 'Profissionais cadastrados' },
  { icone: 'home-outline', numero: '+1200', texto: 'Plantas disponíveis' },
  { icone: 'checkbox-outline', numero: '+3000', texto: 'Projetos realizados' },
];

const VALORES = [
  {
    icone: 'shield-checkmark-outline',
    titulo: 'Confiança',
    texto: 'Garantimos segurança em cada etapa, conectando você aos melhores profissionais.',
  },
  {
    icone: 'leaf-outline',
    titulo: 'Sustentabilidade',
    texto: 'Incentivamos práticas que valorizam a natureza e o futuro do planeta.',
  },
  {
    icone: 'trophy-outline',
    titulo: 'Qualidade',
    texto: 'Trabalhamos com excelência para entregar o melhor em cada detalhe.',
  },
  {
    icone: 'heart-outline',
    titulo: 'Paixão',
    texto: 'Somos movidos pelo amor ao design, à natureza e às boas conexões.',
  },
];

export default function Sobre() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const largo = width >= 900;
  const medio = width >= 600;

  const navegar = (rota) => router.push(rota);

  const larguraValor = largo ? '23%' : medio ? '48%' : '100%';

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <StatusBar barStyle="light-content" />

      {/* Primeira seção: cabeçalho + Quem somos, sobre a foto de fundo */}
      <ImageBackground
        source={require('../../assets/images/BackGroundSobre.png')}
        style={[styles.hero, { minHeight: Math.max(height, 700) }]}
        imageStyle={styles.heroImagem}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Cabeçalho */}
        <View style={[styles.topo, largo ? styles.topoLargo : styles.topoEstreito]}>
          <Pressable onPress={() => navegar('/')}>
            <Image
              source={require('../../assets/images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>

          <View style={[styles.menu, !largo && styles.menuEstreito]}>
            <Pressable style={styles.item} onPress={() => navegar('/')}>
              <Text style={styles.textoItem}>Início</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={() => navegar('/planta')}>
              <Text style={styles.textoItem}>Plantas</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={() => navegar('/profissionais')}>
              <Text style={styles.textoItem}>Profissionais</Text>
            </Pressable>
            <Pressable style={styles.itemAtivo} onPress={() => navegar('/sobre')}>
              <Text style={styles.textoAtivo}>Sobre Nós</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.perfil, !largo && styles.perfilEstreito]}
            onPress={() => navegar('/login')}
          >
            <Ionicons name="person-circle-outline" size={42} color={DOURADO} />
          </Pressable>
        </View>

        {/* Quem somos */}
        <View style={[styles.corpo, largo && styles.corpoLargo]}>
          <View style={styles.texto}>
            <View style={styles.etiquetaLinha}>
              <View style={styles.traco} />
              <Text style={styles.etiquetaTexto}>SOBRE NÓS</Text>
              <View style={styles.traco} />
            </View>

            <Text style={[styles.titulo, largo && styles.tituloLargo]}>
              Quem Somos <Text style={styles.tituloDestaque}>nós?</Text>
            </Text>

            <Text style={styles.paragrafo}>
              A Income Of Houses é uma plataforma dedicada a conectar pessoas à
              natureza. Oferecemos uma seleção de plantas de alta qualidade e
              reunimos profissionais especializados em paisagismo e jardinagem
              para transformar ambientes com praticidade, confiança e excelência.
            </Text>

            <Text style={styles.paragrafo}>
              Nosso compromisso é proporcionar uma experiência simples, segura e
              inspiradora, ajudando você a criar espaços mais verdes, acolhedores
              e cheios de vida.
            </Text>
          </View>

          {/* Estatísticas */}
          <View style={[styles.estatisticas, largo && styles.estatisticasLargo]}>
            {ESTATISTICAS.map((e) => (
              <View key={e.numero} style={styles.estatistica}>
                <Ionicons name={e.icone} size={30} color={DOURADO} />
                <View>
                  <Text style={styles.estNumero}>{e.numero}</Text>
                  <Text style={styles.estTexto}>{e.texto}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ImageBackground>

      {/* Nossos valores */}
      <View style={styles.valores}>
        <View style={[styles.etiquetaLinha, styles.centro]}>
          <View style={styles.traco} />
          <Text style={styles.etiquetaTexto}>NOSSOS VALORES</Text>
          <View style={styles.traco} />
        </View>

        <Text style={[styles.tituloValores, largo && styles.tituloValoresLargo]}>
          O que nos move
        </Text>

        <View style={styles.valoresGrid}>
          {VALORES.map((v) => (
            <View key={v.titulo} style={[styles.valorCard, { width: larguraValor }]}>
              <View style={styles.valorIcone}>
                <Ionicons name={v.icone} size={20} color={DOURADO} />
              </View>
              <Text style={styles.valorTitulo}>{v.titulo}</Text>
              <Text style={styles.valorTexto}>{v.texto}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Rodapé */}
      <View style={[styles.rodape, largo && styles.rodapeLargo]}>
        <Text style={styles.textoRodape}>
          ©IncomeOfHouses. Todos os direitos reservados.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#0d0d0d' },
  conteudo: { flexGrow: 1 },

  // Primeira seção
  hero: { width: '100%', backgroundColor: '#000' },
  heroImagem: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },

  // Cabeçalho (transparente sobre a foto)
  topo: {
    backgroundColor: 'rgba(10, 10, 10, 0.35)',
    paddingHorizontal: 24,
  },
  topoLargo: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 140,
  },
  topoEstreito: { alignItems: 'center', paddingTop: 40, paddingBottom: 16 },
  logo: { width: 110, height: 60 },
  menu: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuEstreito: { flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 },
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
    backgroundColor: 'rgba(28, 26, 20, 0.9)',
  },
  textoItem: { color: '#ffffff', fontSize: 14 },
  textoAtivo: { color: DOURADO, fontSize: 14 },
  perfil: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  perfilEstreito: { position: 'absolute', right: 20, top: 40 },

  // Quem somos
  corpo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 40,
  },
  corpoLargo: { paddingHorizontal: 115, paddingBottom: 140 },
  texto: { maxWidth: 520 },

  etiquetaLinha: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  centro: { justifyContent: 'center' },
  traco: { width: 40, height: 1, backgroundColor: '#6b5a36' },
  etiquetaTexto: { color: DOURADO, fontSize: 13, fontWeight: 'bold', letterSpacing: 2 },

  titulo: { color: '#ffffff', fontSize: 38, fontWeight: '900', lineHeight: 46 },
  tituloLargo: { fontSize: 50, lineHeight: 58 },
  tituloDestaque: { color: DOURADO },
  paragrafo: { color: '#e4e4e4', fontSize: 14, lineHeight: 27, marginTop: 18 },

  // Estatísticas
  estatisticas: {
    backgroundColor: 'rgba(12, 12, 12, 0.92)',
    borderWidth: 1,
    borderColor: '#2f2a1e',
    borderRadius: 14,
    padding: 24,
    gap: 22,
  },
  estatisticasLargo: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    gap: 50,
    paddingHorizontal: 34,
    paddingVertical: 26,
  },
  estatistica: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  estNumero: { color: '#ffffff', fontSize: 19, fontWeight: '800' },
  estTexto: { color: '#cfcfcf', fontSize: 11, marginTop: 2 },

  // Nossos valores
  valores: {
    backgroundColor: '#0d0d0d',
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
    paddingVertical: 70,
    paddingHorizontal: 24,
  },
  tituloValores: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 44,
  },
  tituloValoresLargo: { fontSize: 36 },
  valoresGrid: {
    width: '100%',
    maxWidth: 1300,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  valorCard: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    padding: 26,
    minHeight: 200,
  },
  valorIcone: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#2a2418',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valorTitulo: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginTop: 22 },
  valorTexto: { color: '#a8a8a8', fontSize: 13, lineHeight: 22, marginTop: 12 },

  // Rodapé
  rodape: {
    backgroundColor: '#0d0d0d',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  rodapeLargo: { paddingHorizontal: 115 },
  textoRodape: { color: '#9a9a9a', fontSize: 12 },
});