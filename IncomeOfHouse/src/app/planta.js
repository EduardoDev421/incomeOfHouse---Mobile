import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DOURADO = '#c9a45c';
const POR_PAGINA = 6;

/* ------------------------------------------------------------------ */
/* DADOS DE EXEMPLO                                                    */
/* Troque por seus dados reais (API/banco). Cada planta precisa ter:   */
/* id, nome, tipo, quartos, garagens, area, estilo                     */
/* ------------------------------------------------------------------ */
const PLANTAS = [
  { id: 1, nome: 'Casa Moderna Aurora', tipo: 'Sobrado', quartos: 4, garagens: 3, area: 320, estilo: 'Moderno' },
  { id: 2, nome: 'Residência Horizonte', tipo: 'Casa Térrea', quartos: 3, garagens: 2, area: 180, estilo: 'Contemporâneo' },
  { id: 3, nome: 'Casa Minimal', tipo: 'Casa Térrea', quartos: 2, garagens: 1, area: 95, estilo: 'Minimalista' },
  { id: 4, nome: 'Sobrado Jardins', tipo: 'Sobrado', quartos: 3, garagens: 2, area: 210, estilo: 'Clássico' },
  { id: 5, nome: 'Casa de Campo Serra', tipo: 'Casa de Campo', quartos: 5, garagens: 4, area: 450, estilo: 'Rústico' },
  { id: 6, nome: 'Studio Urbano', tipo: 'Kitnet / Studio', quartos: 1, garagens: 0, area: 45, estilo: 'Industrial' },
  { id: 7, nome: 'Casa Tropical Brisa', tipo: 'Casa de Praia', quartos: 4, garagens: 2, area: 260, estilo: 'Tropical' },
  { id: 8, nome: 'Edícula Gourmet', tipo: 'Edícula', quartos: 1, garagens: 1, area: 55, estilo: 'Escandinavo' },
  { id: 9, nome: 'Residência Neoclássica', tipo: 'Casa de Condomínio', quartos: 5, garagens: 4, area: 520, estilo: 'Neoclássico' },
];

/* ------------------------------------------------------------------ */
/* OPÇÕES DOS FILTROS                                                  */
/* ------------------------------------------------------------------ */
const GRUPOS_TIPO = {
  Residencial: ['Casa Térrea', 'Sobrado', 'Casa Geminada', 'Casa de Condomínio', 'Casa de Campo', 'Casa de Praia', 'Chácara', 'Sítio', 'Fazenda'],
  Apartamentos: ['Apartamento', 'Kitnet / Studio', 'Loft', 'Cobertura'],
  'Construções Especiais': ['Edícula', 'Casa de Madeira', 'Casa Pré-Fabricada', 'Casa Modular'],
  Comercial: ['Loja', 'Sala Comercial', 'Escritório', 'Galpão', 'Prédio Comercial'],
  Industrial: ['Galpão Industrial', 'Fábrica', 'Centro de Distribuição'],
  Lazer: ['Área de Lazer', 'Espaço Gourmet', 'Salão de Festas', 'Área de Piscina'],
  Projetos: ['Projeto Residencial', 'Projeto Comercial', 'Projeto Industrial', 'Projeto Arquitetônico'],
};

const OPCOES_TIPO = [{ label: 'Todos os projetos', valor: '' }];
Object.keys(GRUPOS_TIPO).forEach((grupo) => {
  OPCOES_TIPO.push({ grupo });
  GRUPOS_TIPO[grupo].forEach((t) => OPCOES_TIPO.push({ label: t, valor: t }));
});

const OPCOES_QUARTOS = [
  { label: 'Todos', valor: '' },
  { label: '1 quarto', valor: '1' },
  { label: '2 quartos', valor: '2' },
  { label: '3 quartos', valor: '3' },
  { label: '4 quartos', valor: '4' },
  { label: '5+ quartos', valor: '5+' },
];

const OPCOES_GARAGEM = [
  { label: 'Todas', valor: '' },
  { label: 'Sem garagem', valor: '0' },
  { label: '1 vaga', valor: '1' },
  { label: '2 vagas', valor: '2' },
  { label: '3 vagas', valor: '3' },
  { label: '4+ vagas', valor: '4+' },
];

const OPCOES_AREA = [
  { label: 'Todas as áreas', valor: '' },
  { label: 'Até 60 m²', valor: '0-60' },
  { label: '60 a 100 m²', valor: '60-100' },
  { label: '100 a 150 m²', valor: '100-150' },
  { label: '150 a 200 m²', valor: '150-200' },
  { label: '200 a 300 m²', valor: '200-300' },
  { label: '300 a 500 m²', valor: '300-500' },
  { label: 'Acima de 500 m²', valor: '500-' },
];

const OPCOES_ESTILO = [
  { label: 'Todos os estilos', valor: '' },
  ...['Moderno', 'Contemporâneo', 'Minimalista', 'Clássico', 'Neoclássico', 'Colonial', 'Rústico', 'Industrial', 'Escandinavo', 'Tropical'].map(
    (e) => ({ label: e, valor: e })
  ),
];

const FILTROS_VAZIOS = { tipo: '', quartos: '', garagem: '', area: '', estilo: '' };

/* ------------------------------------------------------------------ */
/* LÓGICA DE FILTRO                                                    */
/* ------------------------------------------------------------------ */
function filtrar(lista, f) {
  return lista.filter((p) => {
    if (f.tipo && p.tipo !== f.tipo) return false;

    if (f.quartos) {
      if (f.quartos === '5+') {
        if (p.quartos < 5) return false;
      } else if (p.quartos !== Number(f.quartos)) return false;
    }

    if (f.garagem) {
      if (f.garagem === '4+') {
        if (p.garagens < 4) return false;
      } else if (p.garagens !== Number(f.garagem)) return false;
    }

    if (f.area) {
      const [min, max] = f.area.split('-');
      const minimo = Number(min) || 0;
      const maximo = max === '' ? Infinity : Number(max);
      if (p.area < minimo || p.area > maximo) return false;
    }

    if (f.estilo && p.estilo !== f.estilo) return false;

    return true;
  });
}

/* ------------------------------------------------------------------ */
/* COMPONENTE: SELETOR (substitui o <select> do HTML)                  */
/* ------------------------------------------------------------------ */
function Seletor({ rotulo, icone, valor, opcoes, aoMudar, largo }) {
  const [aberto, setAberto] = useState(false);
  const atual = opcoes.find((o) => !o.grupo && o.valor === valor);

  return (
    <View style={[styles.campo, largo && styles.campoLargo]}>
      <View style={styles.rotuloLinha}>
        <Ionicons name={icone} size={16} color={DOURADO} />
        <Text style={styles.rotulo}>{rotulo}</Text>
      </View>

      <Pressable style={styles.seletor} onPress={() => setAberto(true)}>
        <Text style={styles.seletorTexto} numberOfLines={1}>
          {atual ? atual.label : ''}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#b5b5b5" />
      </Pressable>

      <Modal
        visible={aberto}
        transparent
        animationType="fade"
        onRequestClose={() => setAberto(false)}
      >
        <Pressable style={styles.modalFundo} onPress={() => setAberto(false)}>
          <Pressable style={styles.modalCaixa} onPress={() => {}}>
            <Text style={styles.modalTitulo}>{rotulo}</Text>
            <ScrollView>
              {opcoes.map((o, i) =>
                o.grupo ? (
                  <Text key={`g${i}`} style={styles.grupo}>
                    {o.grupo}
                  </Text>
                ) : (
                  <Pressable
                    key={`o${i}`}
                    style={[styles.opcao, o.valor === valor && styles.opcaoAtiva]}
                    onPress={() => {
                      aoMudar(o.valor);
                      setAberto(false);
                    }}
                  >
                    <Text
                      style={[styles.opcaoTexto, o.valor === valor && styles.opcaoTextoAtivo]}
                    >
                      {o.label}
                    </Text>
                  </Pressable>
                )
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* TELA                                                                */
/* ------------------------------------------------------------------ */
export default function Plantas() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const largo = width >= 900;

  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [aplicados, setAplicados] = useState(FILTROS_VAZIOS);
  const [pagina, setPagina] = useState(1);

  const navegar = (rota) => router.push(rota);

  const pesquisar = () => {
    setAplicados(filtros);
    setPagina(1);
  };

  const mudar = (campo) => (valor) => setFiltros((f) => ({ ...f, [campo]: valor }));

  const resultado = filtrar(PLANTAS, aplicados);
  const totalPaginas = Math.max(1, Math.ceil(resultado.length / POR_PAGINA));
  const visiveis = resultado.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const mensagem =
    resultado.length === 0
      ? 'Nenhum projeto encontrado com esses filtros.'
      : `${resultado.length} ${resultado.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}`;

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <StatusBar barStyle="light-content" />

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
          <Pressable style={styles.itemAtivo} onPress={() => navegar('/planta')}>
            <Text style={styles.textoAtivo}>Plantas</Text>
          </Pressable>
          <Pressable style={styles.item} onPress={() => navegar('/profissionais')}>
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
        style={styles.hero}
        imageStyle={styles.heroImagem}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />
        <View style={[styles.heroConteudo, largo && styles.heroConteudoLargo]}>
          <View style={styles.etiqueta}>
            <Text style={styles.etiquetaTexto}>Plantas</Text>
          </View>
          <Text style={[styles.heroTitulo, largo && styles.heroTituloLargo]}>
            Encontre o projeto{'\n'}perfeito para você
          </Text>
          <Text style={styles.heroTexto}>
            Explore nossa coleção de plantas arquitetônicas e filtre por suas
            preferências para encontrar o projeto ideal.
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.pagina}>
        {/* Filtros */}
        <View style={styles.filtrosCard}>
          <View style={styles.filtrosGrid}>
            <Seletor
              rotulo="Projetos"
              icone="home-outline"
              valor={filtros.tipo}
              opcoes={OPCOES_TIPO}
              aoMudar={mudar('tipo')}
              largo={largo}
            />
            <Seletor
              rotulo="Quartos"
              icone="bed-outline"
              valor={filtros.quartos}
              opcoes={OPCOES_QUARTOS}
              aoMudar={mudar('quartos')}
              largo={largo}
            />
            <Seletor
              rotulo="Garagens"
              icone="car-outline"
              valor={filtros.garagem}
              opcoes={OPCOES_GARAGEM}
              aoMudar={mudar('garagem')}
              largo={largo}
            />
            <Seletor
              rotulo="Área construída"
              icone="resize-outline"
              valor={filtros.area}
              opcoes={OPCOES_AREA}
              aoMudar={mudar('area')}
              largo={largo}
            />
            <Seletor
              rotulo="Estilo"
              icone="color-palette-outline"
              valor={filtros.estilo}
              opcoes={OPCOES_ESTILO}
              aoMudar={mudar('estilo')}
              largo={largo}
            />

            <Pressable style={[styles.btnPesquisar, largo && styles.btnPesquisarLargo]} onPress={pesquisar}>
              <Ionicons name="search" size={18} color="#1a1a1a" />
              <Text style={styles.btnPesquisarTexto}>Pesquisar</Text>
            </Pressable>
          </View>
        </View>

        {/* Mensagem */}
        <Text style={styles.mensagem}>{mensagem}</Text>

        {/* Lista de plantas */}
        <View style={styles.lista}>
          {visiveis.map((p) => (
            <View key={p.id} style={[styles.card, largo && styles.cardLargo]}>
              <Image
                source={require('../../assets/images/casa.png')}
                style={styles.cardImagem}
                resizeMode="cover"
              />
              <View style={styles.cardCorpo}>
                <Text style={styles.cardTipo}>{p.tipo}</Text>
                <Text style={styles.cardNome}>{p.nome}</Text>

                <View style={styles.specs}>
                  <View style={styles.spec}>
                    <Ionicons name="bed-outline" size={15} color={DOURADO} />
                    <Text style={styles.specTexto}>{p.quartos}</Text>
                  </View>
                  <View style={styles.spec}>
                    <Ionicons name="car-outline" size={15} color={DOURADO} />
                    <Text style={styles.specTexto}>{p.garagens}</Text>
                  </View>
                  <View style={styles.spec}>
                    <Ionicons name="resize-outline" size={15} color={DOURADO} />
                    <Text style={styles.specTexto}>{p.area} m²</Text>
                  </View>
                </View>

                <Text style={styles.cardEstilo}>Estilo {p.estilo}</Text>

                <Pressable
                  style={styles.btnDetalhes}
                  onPress={() =>
                    router.push({
                      pathname: '/detalhesPlantas',
                      params: { id: String(p.id) },
                    })
                  }
                >
                  <Text style={styles.btnDetalhesTexto}>Ver detalhes</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Paginação */}
        {resultado.length > POR_PAGINA && (
          <View style={styles.paginacao}>
            <Pressable
              style={[styles.pagBotao, pagina === 1 && styles.pagDesativado]}
              disabled={pagina === 1}
              onPress={() => setPagina((p) => p - 1)}
            >
              <Ionicons name="chevron-back" size={18} color="#fff" />
            </Pressable>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <Pressable
                key={n}
                style={[styles.pagBotao, n === pagina && styles.pagAtivo]}
                onPress={() => setPagina(n)}
              >
                <Text style={[styles.pagTexto, n === pagina && styles.pagTextoAtivo]}>{n}</Text>
              </Pressable>
            ))}

            <Pressable
              style={[styles.pagBotao, pagina === totalPaginas && styles.pagDesativado]}
              disabled={pagina === totalPaginas}
              onPress={() => setPagina((p) => p + 1)}
            >
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </Pressable>
          </View>
        )}
      </View>

      {/* Rodapé */}
      <View style={styles.rodape}>
        <Text style={styles.textoRodape}>
          ©IncomeOfHouses. Todos os direitos reservados.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/* ESTILOS                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#0a0a0a' },
  conteudo: { flexGrow: 1 },

  // Cabeçalho
  topo: {
    backgroundColor: '#0d0d0d',
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
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
    backgroundColor: '#1c1a14',
  },
  textoItem: { color: '#ffffff', fontSize: 14 },
  textoAtivo: { color: DOURADO, fontSize: 14 },
  perfil: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  perfilEstreito: { position: 'absolute', right: 20, top: 40 },

  // Hero
  hero: { width: '100%', backgroundColor: '#000' },
  heroImagem: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)' },
  heroConteudo: { paddingHorizontal: 24, paddingVertical: 50 },
  heroConteudoLargo: { paddingHorizontal: 150, paddingVertical: 70 },
  etiqueta: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#6b5a36',
    backgroundColor: '#1c1a14',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  etiquetaTexto: { color: DOURADO, fontSize: 12, fontWeight: 'bold' },
  heroTitulo: { color: '#fff', fontSize: 32, fontWeight: '800', lineHeight: 40 },
  heroTituloLargo: { fontSize: 46, lineHeight: 54 },
  heroTexto: { color: '#d0d0d0', fontSize: 15, lineHeight: 24, marginTop: 16, maxWidth: 520 },

  // Página
  pagina: {
    width: '100%',
    maxWidth: 1190,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  // Filtros
  filtrosCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 14,
    padding: 20,
  },
  filtrosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end' },
  campo: { width: '100%' },
  campoLargo: { width: '18%', minWidth: 160, flexGrow: 1 },
  rotuloLinha: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  rotulo: { color: '#d0d0d0', fontSize: 13, fontWeight: 'bold' },
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  seletorTexto: { color: '#fff', fontSize: 14, flex: 1, marginRight: 8 },

  btnPesquisar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: DOURADO,
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  btnPesquisarLargo: { width: 'auto' },
  btnPesquisarTexto: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 14 },

  // Modal do seletor
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCaixa: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '75%',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 14,
    padding: 16,
  },
  modalTitulo: { color: DOURADO, fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  grupo: {
    color: '#8a8a8a',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 4,
  },
  opcao: { paddingVertical: 11, paddingHorizontal: 10, borderRadius: 8 },
  opcaoAtiva: { backgroundColor: '#1c1a14' },
  opcaoTexto: { color: '#fff', fontSize: 14 },
  opcaoTextoAtivo: { color: DOURADO, fontWeight: 'bold' },

  // Mensagem e lista
  mensagem: { color: '#b5b5b5', fontSize: 14, marginTop: 24, marginBottom: 16 },
  lista: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  card: {
    width: '100%',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardLargo: { width: '31.5%', flexGrow: 1 },
  cardImagem: { width: '100%', height: 190, backgroundColor: '#1a1a1a' },
  cardCorpo: { padding: 18 },
  cardTipo: { color: DOURADO, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  cardNome: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  specs: { flexDirection: 'row', gap: 18, marginTop: 12 },
  spec: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  specTexto: { color: '#d0d0d0', fontSize: 13 },
  cardEstilo: { color: '#8a8a8a', fontSize: 13, marginTop: 10 },
  btnDetalhes: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#6b5a36',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  btnDetalhesTexto: { color: DOURADO, fontWeight: 'bold', fontSize: 14 },

  // Paginação
  paginacao: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 30,
  },
  pagBotao: {
    minWidth: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#161616',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pagAtivo: { backgroundColor: DOURADO, borderColor: DOURADO },
  pagDesativado: { opacity: 0.35 },
  pagTexto: { color: '#fff', fontWeight: 'bold' },
  pagTextoAtivo: { color: '#1a1a1a' },

  // Rodapé
  rodape: {
    backgroundColor: '#0d0d0d',
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
    padding: 25,
    alignItems: 'center',
  },
  textoRodape: { color: '#b5b5b5', fontSize: 12, textAlign: 'center' },
});