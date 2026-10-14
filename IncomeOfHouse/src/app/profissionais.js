import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
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

const FUNDO = require('../../assets/images/BackGroundPlantasEProfissionais.png');

/* ------------------------------------------------------------------ */
/* OPÇÕES DOS FILTROS (iguais às do site)                              */
/* ------------------------------------------------------------------ */
const PROFISSOES = [
  ['arquiteto', 'Arquiteto(a)'],
  ['arquiteto-urbanista', 'Arquiteto(a) e Urbanista'],
  ['urbanista', 'Urbanista'],
  ['engenheiro-civil', 'Engenheiro(a) Civil'],
  ['engenheiro-eletrico', 'Engenheiro(a) Eletricista'],
  ['engenheiro-mecanico', 'Engenheiro(a) Mecânico(a)'],
  ['engenheiro-sanitarista', 'Engenheiro(a) Sanitarista'],
  ['engenheiro-ambiental', 'Engenheiro(a) Ambiental'],
  ['designer-de-interiores', 'Designer de Interiores'],
  ['desenhista-projetista', 'Desenhista Projetista'],
  ['desenhista-cadista', 'Desenhista CAD'],
  ['projetista-arquitetonico', 'Projetista Arquitetônico'],
  ['projetista-de-edificacoes', 'Projetista de Edificações'],
  ['tecnico-em-edificacoes', 'Técnico(a) em Edificações'],
  ['modelador-3d', 'Modelador(a) 3D'],
  ['artista-3d', 'Artista 3D'],
  ['renderizador-3d', 'Renderizador(a) 3D'],
  ['especialista-bim', 'Especialista BIM'],
  ['coordenador-bim', 'Coordenador(a) BIM'],
  ['projetista-eletrico', 'Projetista Elétrico'],
  ['projetista-hidraulico', 'Projetista Hidráulico'],
  ['projetista-estrutural', 'Projetista Estrutural'],
  ['projetista-sanitario', 'Projetista Sanitário'],
  ['projetista-de-incendio', 'Projetista de Prevenção contra Incêndio'],
  ['projetista-de-climatizacao', 'Projetista de Climatização'],
  ['calculista-estrutural', 'Calculista Estrutural'],
  ['tecnico-em-construcao', 'Técnico(a) em Construção Civil'],
  ['tecnico-em-estruturas', 'Técnico(a) em Estruturas'],
  ['topografo', 'Topógrafo(a)'],
  ['tecnico-em-topografia', 'Técnico(a) em Topografia'],
  ['agrimensor', 'Agrimensor(a)'],
  ['paisagista', 'Paisagista'],
  ['projetista-de-paisagismo', 'Projetista de Paisagismo'],
  ['planejador-de-obras', 'Planejador(a) de Obras'],
  ['gestor-de-projetos', 'Gestor(a) de Projetos'],
  ['compatibilizador-de-projetos', 'Compatibilizador(a) de Projetos'],
  ['consultor-em-arquitetura', 'Consultor(a) em Arquitetura'],
  ['consultor-em-projetos', 'Consultor(a) em Projetos'],
];

const ESTADOS = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'],
  ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'],
  ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'],
  ['MG', 'Minas Gerais'], ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'],
  ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'],
  ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins'],
];

const EXPERIENCIAS = [8, 9, 10, 12, 15, 18];
const AVALIACOES = [5, 4.9, 4.8, 4.7];

const TODAS = { label: 'Todas', valor: '' };
const OPCOES_PROFISSAO = [TODAS, ...PROFISSOES.map(([v, l]) => ({ label: l, valor: v }))];
const OPCOES_ESTADO = [TODAS, ...ESTADOS.map(([v, l]) => ({ label: l, valor: v }))];
const OPCOES_EXPERIENCIA = [TODAS, ...EXPERIENCIAS.map((n) => ({ label: `${n} anos`, valor: String(n) }))];
const OPCOES_AVALIACAO = [TODAS, ...AVALIACOES.map((n) => ({ label: n.toFixed(1), valor: String(n) }))];

const NOME_PROFISSAO = Object.fromEntries(PROFISSOES);
const NOME_ESTADO = Object.fromEntries(ESTADOS);

/* ------------------------------------------------------------------ */
/* DADOS DE EXEMPLO (nomes fictícios)                                  */
/* Troque por seus dados reais (API/banco). Cada profissional precisa  */
/* ter: id, nome, profissao (valor da lista), estado (UF), anos,       */
/* avaliacao. Opcional: foto (ex.: require('...') ou { uri: '...' })   */
/* ------------------------------------------------------------------ */
const PROFISSIONAIS = [
  { id: 1, nome: 'Carlos Mendes', profissao: 'engenheiro-civil', estado: 'AM', anos: 15, avaliacao: 5.0 },
  { id: 2, nome: 'Ana Beatriz Souza', profissao: 'arquiteto', estado: 'SP', anos: 12, avaliacao: 4.9 },
  { id: 3, nome: 'Rafael Lima', profissao: 'designer-de-interiores', estado: 'RJ', anos: 10, avaliacao: 4.8 },
  { id: 4, nome: 'Juliana Castro', profissao: 'paisagista', estado: 'MG', anos: 9, avaliacao: 4.9 },
  { id: 5, nome: 'Marcos Oliveira', profissao: 'topografo', estado: 'GO', anos: 18, avaliacao: 4.7 },
  { id: 6, nome: 'Fernanda Alves', profissao: 'especialista-bim', estado: 'DF', anos: 8, avaliacao: 5.0 },
  { id: 7, nome: 'Paulo Henrique Dias', profissao: 'projetista-estrutural', estado: 'PR', anos: 15, avaliacao: 4.8 },
  { id: 8, nome: 'Camila Rocha', profissao: 'arquiteto-urbanista', estado: 'BA', anos: 12, avaliacao: 4.7 },
];

const FILTROS_VAZIOS = { profissao: '', estado: '', experiencia: '', avaliacao: '' };

/* ------------------------------------------------------------------ */
/* LÓGICA DE FILTRO                                                    */
/* ------------------------------------------------------------------ */
function filtrar(lista, f) {
  return lista.filter((p) => {
    if (f.profissao && p.profissao !== f.profissao) return false;
    if (f.estado && p.estado !== f.estado) return false;
    if (f.experiencia && p.anos !== Number(f.experiencia)) return false;
    // Avaliação: mostra quem tem nota igual ou maior que a escolhida
    if (f.avaliacao && p.avaliacao < Number(f.avaliacao)) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* COMPONENTE: SELETOR (substitui o <select> do HTML)                  */
/* ------------------------------------------------------------------ */
function Seletor({ rotulo, icone, valor, opcoes, aoMudar, largo }) {
  const [aberto, setAberto] = useState(false);
  const atual = opcoes.find((o) => o.valor === valor);

  return (
    <View style={[styles.campo, largo && styles.campoLargo]}>
      <View style={styles.rotuloLinha}>
        <Ionicons name={icone} size={15} color={DOURADO} />
        <Text style={styles.rotulo}>{rotulo}</Text>
      </View>

      <Pressable style={styles.seletor} onPress={() => setAberto(true)}>
        <Text style={styles.seletorTexto} numberOfLines={1}>
          {atual ? atual.label : ''}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#b5b5b5" />
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
              {opcoes.map((o, i) => (
                <Pressable
                  key={`o${i}`}
                  style={[styles.opcao, o.valor === valor && styles.opcaoAtiva]}
                  onPress={() => {
                    aoMudar(o.valor);
                    setAberto(false);
                  }}
                >
                  <Text style={[styles.opcaoTexto, o.valor === valor && styles.opcaoTextoAtivo]}>
                    {o.label}
                  </Text>
                </Pressable>
              ))}
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
export default function Profissionais() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const largo = width >= 900;
  const medio = width >= 600;

  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [aplicados, setAplicados] = useState(FILTROS_VAZIOS);
  const [pagina, setPagina] = useState(1);
  const [favoritos, setFavoritos] = useState([]);

  const navegar = (rota) => router.push(rota);

  const pesquisar = () => {
    setAplicados(filtros);
    setPagina(1);
  };

  const mudar = (campo) => (valor) => setFiltros((f) => ({ ...f, [campo]: valor }));

  const alternarFavorito = (id) =>
    setFavoritos((lista) => (lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]));

  const resultado = filtrar(PROFISSIONAIS, aplicados);
  const totalPaginas = Math.max(1, Math.ceil(resultado.length / POR_PAGINA));
  const visiveis = resultado.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const mensagem =
    resultado.length === 0
      ? 'Nenhum profissional encontrado com esses filtros.'
      : `${resultado.length} ${resultado.length === 1 ? 'profissional encontrado' : 'profissionais encontrados'}`;

  const larguraCard = largo ? '31.3%' : medio ? '48%' : '100%';

  return (
    <View style={styles.raiz}>
      <StatusBar barStyle="light-content" />

      {/* Fundo da página inteira */}
      <Image source={FUNDO} style={styles.fundoImagem} resizeMode="cover" />
      <View style={styles.fundoOverlay} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo}>
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
            <Pressable style={styles.itemAtivo} onPress={() => navegar('/profissionais')}>
              <Text style={styles.textoAtivo}>Profissionais</Text>
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

        <View style={styles.pagina}>
          {/* Título */}
          <View style={styles.etiquetaLinha}>
            <View style={styles.etiquetaTraco} />
            <Text style={styles.etiquetaTexto}>PROFISSIONAIS</Text>
            <View style={styles.etiquetaTraco} />
          </View>

          <Text style={[styles.titulo, largo && styles.tituloLargo]}>
            Encontre um profissional{'\n'}perfeito para você
          </Text>
          <View style={styles.tituloBarra} />

          <Text style={styles.subtitulo}>
            Navegue e encontre o profissional perfeito para seu projeto
          </Text>

          {/* Filtros */}
          <View style={styles.filtrosCard}>
            <View style={styles.filtrosGrid}>
              <Seletor
                rotulo="Profissão"
                icone="person-outline"
                valor={filtros.profissao}
                opcoes={OPCOES_PROFISSAO}
                aoMudar={mudar('profissao')}
                largo={largo}
              />
              <Seletor
                rotulo="Estado"
                icone="location-outline"
                valor={filtros.estado}
                opcoes={OPCOES_ESTADO}
                aoMudar={mudar('estado')}
                largo={largo}
              />
              <Seletor
                rotulo="Experiência"
                icone="time-outline"
                valor={filtros.experiencia}
                opcoes={OPCOES_EXPERIENCIA}
                aoMudar={mudar('experiencia')}
                largo={largo}
              />
              <Seletor
                rotulo="Avaliação"
                icone="star-outline"
                valor={filtros.avaliacao}
                opcoes={OPCOES_AVALIACAO}
                aoMudar={mudar('avaliacao')}
                largo={largo}
              />
            </View>

            <Pressable style={styles.btnPesquisar} onPress={pesquisar}>
              <Ionicons name="search" size={17} color="#1a1a1a" />
              <Text style={styles.btnPesquisarTexto}>Pesquisar</Text>
            </Pressable>
          </View>

          {/* Mensagem */}
          <Text style={styles.mensagem}>{mensagem}</Text>

          {/* Cards */}
          <View style={styles.lista}>
            {visiveis.map((p) => {
              const favorito = favoritos.includes(p.id);
              return (
                <View key={p.id} style={[styles.card, { width: larguraCard }]}>
                  <View style={styles.fotoArea}>
                    {p.foto ? (
                      <Image source={p.foto} style={styles.foto} resizeMode="cover" />
                    ) : (
                      <Ionicons name="person" size={70} color="#333" />
                    )}

                    <Pressable
                      style={styles.favorito}
                      onPress={() => alternarFavorito(p.id)}
                    >
                      <Ionicons
                        name={favorito ? 'heart' : 'heart-outline'}
                        size={18}
                        color={favorito ? DOURADO : '#ffffff'}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.cardCorpo}>
                    <Text style={styles.cardNome}>{p.nome}</Text>

                    <View style={styles.specs}>
                      <Text style={styles.spec}>{NOME_PROFISSAO[p.profissao]}</Text>
                      <Text style={styles.spec}>{NOME_ESTADO[p.estado]}</Text>
                      <Text style={styles.spec}>{p.anos} anos</Text>
                      <Text style={styles.spec}>{p.avaliacao.toFixed(1)} estrelas</Text>
                    </View>

                    <Pressable
                      style={styles.btnDetalhes}
                      onPress={() =>
                        router.push({
                          pathname: '/detalhesProfissionais',
                          params: { id: String(p.id) },
                        })
                      }
                    >
                      <Text style={styles.btnDetalhesTexto}>Detalhes</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Paginação */}
          {resultado.length > 0 && (
            <View style={styles.paginacao}>
              <Pressable
                style={[styles.pagBotao, pagina === 1 && styles.pagDesativado]}
                disabled={pagina === 1}
                onPress={() => setPagina((p) => p - 1)}
              >
                <Ionicons name="chevron-back" size={16} color="#fff" />
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
                <Ionicons name="chevron-forward" size={16} color="#fff" />
              </Pressable>
            </View>
          )}
        </View>

        {/* Rodapé */}
        <View style={[styles.rodape, largo && styles.rodapeLargo]}>
          <Text style={styles.textoRodape}>
            ©IncomeOfHouses. Todos os direitos reservados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* ESTILOS                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#0a0a0a' },

  // Fundo fixo atrás de tudo
  fundoImagem: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fundoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.45)' },

  scroll: { flex: 1, backgroundColor: 'transparent' },
  conteudo: { flexGrow: 1 },

  // Cabeçalho
  topo: {
    backgroundColor: 'rgba(10, 10, 10, 0.55)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
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

  // Conteúdo
  pagina: {
    width: '100%',
    maxWidth: 1300,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 50,
  },

  // Título
  etiquetaLinha: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  etiquetaTraco: { width: 40, height: 1, backgroundColor: '#6b5a36' },
  etiquetaTexto: { color: DOURADO, fontSize: 13, fontWeight: 'bold', letterSpacing: 2 },
  titulo: { color: '#ffffff', fontSize: 30, fontWeight: '800', lineHeight: 38 },
  tituloLargo: { fontSize: 34, lineHeight: 39 },
  tituloBarra: {
    width: 46,
    height: 3,
    backgroundColor: DOURADO,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 16,
  },
  subtitulo: { color: '#d8d8d8', fontSize: 14, lineHeight: 22, marginBottom: 22 },

  // Filtros
  filtrosCard: {
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 30,
  },
  filtrosGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 30, rowGap: 22 },
  campo: { width: '100%' },
  campoLargo: { width: '48.5%' },
  rotuloLinha: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  rotulo: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#2c2c2c',
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 14,
  },
  seletorTexto: { color: '#ffffff', fontSize: 13, flex: 1, marginRight: 8 },

  btnPesquisar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: DOURADO,
    borderRadius: 8,
    height: 46,
    marginTop: 24,
  },
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
  opcao: { paddingVertical: 11, paddingHorizontal: 10, borderRadius: 8 },
  opcaoAtiva: { backgroundColor: '#1c1a14' },
  opcaoTexto: { color: '#fff', fontSize: 14 },
  opcaoTextoAtivo: { color: DOURADO, fontWeight: 'bold' },

  // Mensagem e cards
  mensagem: { color: '#c8c8c8', fontSize: 14, marginTop: 26, marginBottom: 16 },
  lista: { flexDirection: 'row', flexWrap: 'wrap', gap: 22 },
  card: {
    backgroundColor: 'rgba(22, 22, 22, 0.96)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 14,
    overflow: 'hidden',
  },
  fotoArea: {
    height: 210,
    backgroundColor: '#1d1d1d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foto: { width: '100%', height: '100%' },
  favorito: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCorpo: { padding: 20 },
  cardNome: { color: '#ffffff', fontSize: 17, fontWeight: 'bold' },
  specs: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 4, marginTop: 8 },
  spec: { color: '#b5b5b5', fontSize: 12 },
  btnDetalhes: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#6b5a36',
    backgroundColor: '#1c1a14',
    borderRadius: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDetalhesTexto: { color: DOURADO, fontWeight: 'bold', fontSize: 13 },

  // Paginação
  paginacao: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 40,
  },
  pagBotao: {
    minWidth: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2c2c2c',
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pagAtivo: { backgroundColor: DOURADO, borderColor: DOURADO },
  pagDesativado: { opacity: 0.35 },
  pagTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  pagTextoAtivo: { color: '#1a1a1a' },

  // Rodapé
  rodape: {
    backgroundColor: 'rgba(10, 10, 10, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201, 164, 92, 0.5)',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  rodapeLargo: { paddingHorizontal: 115 },
  textoRodape: { color: '#9a9a9a', fontSize: 12 },
});