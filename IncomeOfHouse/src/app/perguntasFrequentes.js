import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DOURADO = '#c9a45c';

const FUNDO = require('../../assets/images/BackgroundFundo.png');

/* ------------------------------------------------------------------ */
/* MENU LATERAL DA CONTA                                               */
/* As rotas abaixo precisam existir em src/app/ para funcionar.        */
/* ------------------------------------------------------------------ */
const MENU_LATERAL = [
  { icone: 'person-outline', texto: 'Meu Perfil', rota: '/perfilProfissional' },
  { icone: 'location-outline', texto: 'Meus Endereços', rota: '/meusEnderecos' },
  { icone: 'folder-open-outline', texto: 'Meus Pedidos', rota: '/meusPedidos' },
  { icone: 'star-outline', texto: 'Meus Profissionais Favoritos', rota: '/meusProfissionais' },
  { icone: 'bookmark-outline', texto: 'Projetos Salvos', rota: '/projetosSalvos' },
  { icone: 'calendar-outline', texto: 'Agendamentos', rota: '/agendamentos' },
  { icone: 'chatbubble-outline', texto: 'Mensagem', rota: '/mensagem' },
  { icone: 'settings-outline', texto: 'Configurações', rota: '/configuracoesProfissionais', ativo: true },
  { icone: 'log-out-outline', texto: 'Sair', rota: '/' },
];

/* ------------------------------------------------------------------ */
/* PERGUNTAS E RESPOSTAS                                               */
/* Só a categoria "Conta e Acesso" veio preenchida no seu HTML.        */
/* Para as outras, basta adicionar itens { pergunta, resposta } em     */
/* "perguntas" de cada categoria.                                      */
/* ------------------------------------------------------------------ */
const CATEGORIAS = [
  {
    id: 'conta',
    icone: 'log-in-outline',
    titulo: 'Conta e Acesso',
    descricao: 'Informações sobre login, cadastro e conta.',
    subtitulo: 'Respostas sobre login, cadastro, senha e acesso à plataforma.',
    perguntas: [
      {
        pergunta: 'Como faço para me cadastrar na plataforma?',
        resposta:
          'Clique em "Cadastre-se" na página inicial e preencha seus dados. Após a confirmação do e-mail, sua conta estará ativa.',
      },
      {
        pergunta: 'Esqueci minha senha. Como recupero?',
        resposta:
          'Na página de login, clique em "Esqueceu sua senha?" e siga as instruções enviadas por e-mail.',
      },
      {
        pergunta: 'Posso ter mais de um dispositivo conectado?',
        resposta:
          'Sim, você pode acessar sua conta em múltiplos dispositivos, mas por segurança recomendamos sair dos dispositivos que não estiver usando.',
      },
      {
        pergunta: 'Como alterar meus dados de perfil?',
        resposta:
          'Acesse a seção "Meu Perfil" no menu lateral e clique em "Editar" para atualizar suas informações.',
      },
      {
        pergunta: 'Existe um limite de dispositivos conectados?',
        resposta:
          'Não há um limite específico, mas recomendamos manter apenas os dispositivos que você utiliza regularmente.',
      },
      {
        pergunta: 'Minha conta foi bloqueada. O que fazer?',
        resposta:
          'Entre em contato com nosso suporte através da página "Fale Conosco" para verificarmos o motivo do bloqueio e orientarmos a liberação.',
      },
    ],
  },
  {
    id: 'pagamentos',
    icone: 'card-outline',
    titulo: 'Pagamentos',
    descricao: 'Dúvidas sobre valores, formas de pagamento e notas fiscais.',
    subtitulo: 'Respostas sobre valores, formas de pagamento e notas fiscais.',
    perguntas: [],
  },
  {
    id: 'projetos',
    icone: 'folder-open-outline',
    titulo: 'Projetos e Plantas',
    descricao: 'Informações sobre aquisição, formatos e uso das plantas.',
    subtitulo: 'Respostas sobre aquisição, formatos e uso das plantas.',
    perguntas: [],
  },
  {
    id: 'profissionais',
    icone: 'star-outline',
    titulo: 'Profissionais',
    descricao: 'Dúvidas sobre contratação e contato com profissionais.',
    subtitulo: 'Respostas sobre contratação e contato com profissionais.',
    perguntas: [],
  },
  {
    id: 'agendamentos',
    icone: 'calendar-outline',
    titulo: 'Agendamentos',
    descricao: 'Informações sobre como agendar e gerenciar seus projetos.',
    subtitulo: 'Respostas sobre como agendar e gerenciar seus projetos.',
    perguntas: [],
  },
  {
    id: 'suporte',
    icone: 'headset-outline',
    titulo: 'Suporte Técnico',
    descricao: 'Ajuda com problemas técnicos e funcionalidades da plataforma.',
    subtitulo: 'Respostas sobre problemas técnicos e funcionalidades da plataforma.',
    perguntas: [],
  },
];

// Remove acentos e deixa minúsculo, para a busca ignorar acentuação
const normalizar = (t) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/* ------------------------------------------------------------------ */
/* COMPONENTE: PERGUNTA                                                */
/* ------------------------------------------------------------------ */
function Pergunta({ item }) {
  const [aberta, setAberta] = useState(true);

  return (
    <Pressable style={styles.pergunta} onPress={() => setAberta((a) => !a)}>
      <View style={styles.perguntaIcone}>
        <Ionicons name="help-circle-outline" size={20} color={DOURADO} />
      </View>
      <View style={styles.perguntaTextos}>
        <Text style={styles.perguntaTitulo}>{item.pergunta}</Text>
        {aberta && <Text style={styles.perguntaResposta}>{item.resposta}</Text>}
      </View>
      <Ionicons
        name={aberta ? 'chevron-down' : 'chevron-forward'}
        size={18}
        color={DOURADO}
      />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* TELA                                                                */
/* ------------------------------------------------------------------ */
export default function PerguntasFrequentes() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const largo = width >= 1000;
  const topoLargo = width >= 900;

  const [busca, setBusca] = useState('');
  const [categoriaId, setCategoriaId] = useState('conta');

  const navegar = (rota) => router.push(rota);

  const categoria = CATEGORIAS.find((c) => c.id === categoriaId);
  const termo = normalizar(busca.trim());
  const buscando = termo.length > 0;

  // Com busca: procura em todas as categorias. Sem busca: mostra a categoria escolhida.
  const resultados = buscando
    ? CATEGORIAS.flatMap((c) => c.perguntas).filter(
        (p) => normalizar(p.pergunta).includes(termo) || normalizar(p.resposta).includes(termo)
      )
    : [];

  const lista = buscando ? resultados : categoria.perguntas;

  return (
    <View style={styles.raiz}>
      <StatusBar barStyle="light-content" />

      {/* Fundo da página inteira */}
      <Image source={FUNDO} style={styles.fundoImagem} resizeMode="cover" />
      <View style={styles.fundoOverlay} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <View style={[styles.topo, topoLargo ? styles.topoLargo : styles.topoEstreito]}>
          <Pressable onPress={() => navegar('/')}>
            <Image
              source={require('../../assets/images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>

          <View style={[styles.menu, !topoLargo && styles.menuEstreito]}>
            <Pressable style={styles.item} onPress={() => navegar('/')}>
              <Text style={styles.textoItem}>Início</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={() => navegar('/planta')}>
              <Text style={styles.textoItem}>Plantas</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={() => navegar('/profissionais')}>
              <Text style={styles.textoItem}>Profissionais</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={() => navegar('/sobre')}>
              <Text style={styles.textoItem}>Sobre Nós</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.perfil, !topoLargo && styles.perfilEstreito]}
            onPress={() => navegar('/login')}
          >
            <Ionicons name="person-circle-outline" size={42} color={DOURADO} />
          </Pressable>
        </View>

        <View style={[styles.container, largo && styles.containerLargo]}>
          {/* Menu lateral */}
          {largo ? (
            <View style={styles.lateral}>
              {MENU_LATERAL.map((m) => (
                <Pressable
                  key={m.texto}
                  style={[styles.lateralItem, m.ativo && styles.lateralItemAtivo]}
                  onPress={() => navegar(m.rota)}
                >
                  <Ionicons name={m.icone} size={19} color={m.ativo ? DOURADO : '#d0d0d0'} />
                  <Text style={[styles.lateralTexto, m.ativo && styles.lateralTextoAtivo]}>
                    {m.texto}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.abas}
              style={styles.abasScroll}
            >
              {MENU_LATERAL.map((m) => (
                <Pressable
                  key={m.texto}
                  style={[styles.aba, m.ativo && styles.abaAtiva]}
                  onPress={() => navegar(m.rota)}
                >
                  <Ionicons name={m.icone} size={16} color={m.ativo ? DOURADO : '#d0d0d0'} />
                  <Text style={[styles.abaTexto, m.ativo && styles.abaTextoAtivo]}>{m.texto}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Conteúdo */}
          <View style={styles.principal}>
            <Text style={[styles.titulo, !largo && styles.tituloEstreito]}>
              Perguntas Frequentes
            </Text>
            <Text style={styles.subtitulo}>
              Encontre respostas rápidas para as dúvidas mais comuns sobre a plataforma.
            </Text>

            {/* Busca */}
            <View style={styles.busca}>
              <Ionicons name="search" size={20} color="#9a9a9a" />
              <TextInput
                style={styles.buscaInput}
                placeholder="Busque por uma pergunta ou palavra-chave..."
                placeholderTextColor="#777777"
                value={busca}
                onChangeText={setBusca}
              />
              <Pressable style={styles.btnLimpar} onPress={() => setBusca('')}>
                <Text style={styles.btnLimparTexto}>Limpar busca</Text>
              </Pressable>
            </View>

            <View style={[styles.faq, largo && styles.faqLargo]}>
              {/* Categorias */}
              {largo ? (
                <View style={styles.categorias}>
                  {CATEGORIAS.map((c) => {
                    const ativa = !buscando && c.id === categoriaId;
                    return (
                      <Pressable
                        key={c.id}
                        style={[styles.categoria, ativa && styles.categoriaAtiva]}
                        onPress={() => {
                          setBusca('');
                          setCategoriaId(c.id);
                        }}
                      >
                        <View style={styles.categoriaIcone}>
                          <Ionicons name={c.icone} size={20} color={DOURADO} />
                        </View>
                        <View style={styles.categoriaTextos}>
                          <Text style={[styles.categoriaTitulo, ativa && styles.categoriaTituloAtivo]}>
                            {c.titulo}
                          </Text>
                          <Text style={styles.categoriaDescricao}>{c.descricao}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={DOURADO} />
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.abas}
                  style={styles.abasScroll}
                >
                  {CATEGORIAS.map((c) => {
                    const ativa = !buscando && c.id === categoriaId;
                    return (
                      <Pressable
                        key={c.id}
                        style={[styles.aba, ativa && styles.abaAtiva]}
                        onPress={() => {
                          setBusca('');
                          setCategoriaId(c.id);
                        }}
                      >
                        <Ionicons name={c.icone} size={16} color={ativa ? DOURADO : '#d0d0d0'} />
                        <Text style={[styles.abaTexto, ativa && styles.abaTextoAtivo]}>
                          {c.titulo}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}

              {/* Perguntas */}
              <View style={styles.perguntas}>
                <View style={styles.perguntasTitulo}>
                  <View style={styles.categoriaIcone}>
                    <Ionicons
                      name={buscando ? 'search-outline' : categoria.icone}
                      size={20}
                      color={DOURADO}
                    />
                  </View>
                  <View style={styles.categoriaTextos}>
                    <Text style={styles.perguntasH2}>
                      {buscando ? 'Resultados da busca' : categoria.titulo}
                    </Text>
                    <Text style={styles.perguntasP}>
                      {buscando
                        ? `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'} para "${busca.trim()}"`
                        : categoria.subtitulo}
                    </Text>
                  </View>
                </View>

                {lista.length > 0 ? (
                  lista.map((item) => <Pergunta key={item.pergunta} item={item} />)
                ) : (
                  <Text style={styles.vazio}>
                    {buscando
                      ? 'Nenhuma pergunta encontrada. Tente outra palavra-chave.'
                      : 'As perguntas desta categoria serão adicionadas em breve.'}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Rodapé */}
        <View style={[styles.rodape, topoLargo && styles.rodapeLargo]}>
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

  fundoImagem: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fundoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },

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
  textoItem: { color: '#ffffff', fontSize: 14 },
  perfil: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  perfilEstreito: { position: 'absolute', right: 20, top: 40 },

  // Estrutura (menu lateral + conteúdo)
  container: {
    width: '100%',
    maxWidth: 1300,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 50,
    gap: 20,
  },
  containerLargo: { flexDirection: 'row', alignItems: 'flex-start', gap: 28, paddingHorizontal: 24 },

  // Menu lateral (tela larga)
  lateral: {
    width: 270,
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  lateralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  lateralItemAtivo: { backgroundColor: '#1c1a14', borderColor: '#6b5a36' },
  lateralTexto: { color: '#d0d0d0', fontSize: 14, flexShrink: 1 },
  lateralTextoAtivo: { color: DOURADO, fontWeight: 'bold' },

  // Abas horizontais (celular)
  abasScroll: { flexGrow: 0 },
  abas: { gap: 8, paddingRight: 8 },
  aba: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2c2c2c',
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
  },
  abaAtiva: { backgroundColor: '#1c1a14', borderColor: '#6b5a36' },
  abaTexto: { color: '#d0d0d0', fontSize: 13 },
  abaTextoAtivo: { color: DOURADO, fontWeight: 'bold' },

  // Conteúdo
  principal: { flex: 1, width: '100%' },
  titulo: { color: '#ffffff', fontSize: 34, fontWeight: '800' },
  tituloEstreito: { fontSize: 28 },
  subtitulo: { color: '#d0d0d0', fontSize: 14, lineHeight: 22, marginTop: 10, marginBottom: 24 },

  // Busca
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  buscaInput: { flex: 1, minWidth: 180, height: 40, color: '#ffffff', fontSize: 14 },
  btnLimpar: {
    borderWidth: 1,
    borderColor: '#6b5a36',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  btnLimparTexto: { color: DOURADO, fontSize: 13, fontWeight: 'bold' },

  // FAQ
  faq: { gap: 20 },
  faqLargo: { flexDirection: 'row', alignItems: 'flex-start' },

  categorias: { width: 380, gap: 10 },
  categoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    padding: 16,
  },
  categoriaAtiva: { backgroundColor: '#1c1a14', borderColor: '#6b5a36' },
  categoriaIcone: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2a2418',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriaTextos: { flex: 1 },
  categoriaTitulo: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  categoriaTituloAtivo: { color: DOURADO },
  categoriaDescricao: { color: '#a8a8a8', fontSize: 12, lineHeight: 18, marginTop: 3 },

  // Perguntas
  perguntas: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 22,
  },
  perguntasTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 18,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  perguntasH2: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  perguntasP: { color: '#b5b5b5', fontSize: 13, lineHeight: 20, marginTop: 3 },

  pergunta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  perguntaIcone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2a2418',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perguntaTextos: { flex: 1 },
  perguntaTitulo: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', lineHeight: 22 },
  perguntaResposta: { color: '#b5b5b5', fontSize: 13, lineHeight: 22, marginTop: 6 },

  vazio: { color: '#a8a8a8', fontSize: 14, lineHeight: 22, paddingVertical: 28, textAlign: 'center' },

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