import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
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
const DOURADO_BOTAO = '#d9b45f';
const LIMITE = 1000;

const FUNDO = require('../../assets/images/BackgroundFundo.png');

/* ------------------------------------------------------------------ */
/* MENU LATERAL DA CONTA                                               */
/* As rotas abaixo precisam existir em src/app/ para funcionar         */
/* (ex.: src/app/perfilProfissional.js). Ajuste os nomes se quiser.    */
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

const CONTATOS = [
  {
    icone: 'mail-outline',
    titulo: 'E-mail',
    linhas: ['contato@incomeofhouses.com', 'Respondemos em até 24 horas.'],
  },
  {
    icone: 'call-outline',
    titulo: 'Telefone',
    linhas: ['(11) 98765-4321', 'Atendimento de segunda a sexta, das 9h às 18h.'],
  },
  {
    icone: 'location-outline',
    titulo: 'Endereço',
    linhas: ['Av. Paulista, 1000 - Bela Vista', 'São Paulo - SP, 01310-100'],
  },
  {
    icone: 'logo-whatsapp',
    titulo: 'WhatsApp',
    linhas: ['(11) 98765-4321', 'Fale conosco diretamente.'],
  },
];

const OPCOES_ASSUNTO = [
  { label: 'Selecione um assunto', valor: '' },
  { label: 'Dúvida', valor: 'duvida' },
  { label: 'Orçamento', valor: 'orcamento' },
  { label: 'Parceria', valor: 'parceria' },
  { label: 'Suporte', valor: 'suporte' },
  { label: 'Elogio', valor: 'elogio' },
  { label: 'Reclamação', valor: 'reclamacao' },
  { label: 'Outro', valor: 'outro' },
];

const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

/* ------------------------------------------------------------------ */
/* COMPONENTE: SELETOR (substitui o <select> do HTML)                  */
/* ------------------------------------------------------------------ */
function Seletor({ valor, opcoes, aoMudar }) {
  const [aberto, setAberto] = useState(false);
  const atual = opcoes.find((o) => o.valor === valor) || opcoes[0];

  return (
    <View>
      <Pressable style={styles.seletor} onPress={() => setAberto(true)}>
        <Text style={[styles.seletorTexto, !valor && styles.placeholder]} numberOfLines={1}>
          {atual.label}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#ffffff" />
      </Pressable>

      <Modal
        visible={aberto}
        transparent
        animationType="fade"
        onRequestClose={() => setAberto(false)}
      >
        <Pressable style={styles.modalFundo} onPress={() => setAberto(false)}>
          <Pressable style={styles.modalCaixa} onPress={() => {}}>
            <Text style={styles.modalTitulo}>Assunto</Text>
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
export default function FaleConosco() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const largo = width >= 1000;
  const topoLargo = width >= 900;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [aceitou, setAceitou] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const navegar = (rota) => router.push(rota);

  const enviar = () => {
    setSucesso(false);

    if (!nome.trim()) return setErro('Informe seu nome completo.');
    if (!emailValido(email)) return setErro('Informe um e-mail válido.');
    if (!assunto) return setErro('Selecione um assunto.');
    if (!mensagem.trim()) return setErro('Digite sua mensagem.');
    if (!aceitou) return setErro('Aceite a Política de Privacidade para continuar.');

    setErro('');

    const contato = {
      nome: nome.trim(),
      email: email.trim(),
      assunto,
      mensagem: mensagem.trim(),
    };

    // TODO: enviar "contato" para o seu backend / serviço de e-mail aqui.
    console.log('Mensagem pronta para enviar:', contato);

    setSucesso(true);
    setNome('');
    setEmail('');
    setAssunto('');
    setMensagem('');
    setAceitou(false);
  };

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
            <Text style={[styles.titulo, !largo && styles.tituloEstreito]}>Fale Conosco</Text>
            <Text style={styles.subtitulo}>
              Estamos aqui para te ajudar. Envie sua mensagem e retornaremos o mais breve
              possível.
            </Text>

            <View style={[styles.grid, largo && styles.gridLargo]}>
              {/* Informações de contato */}
              <View style={[styles.card, largo && styles.cardInfo]}>
                <Text style={styles.eyebrow}>ENTRE EM CONTATO</Text>
                <Text style={styles.cardTitulo}>Estamos prontos para te atender.</Text>
                <Text style={styles.intro}>
                  Tire suas dúvidas, compartilhe sugestões ou fale sobre parcerias. Será um
                  prazer conversar com você.
                </Text>

                <View style={styles.infoLista}>
                  {CONTATOS.map((c) => (
                    <View key={c.titulo} style={styles.infoLinha}>
                      <View style={styles.infoIcone}>
                        <Ionicons name={c.icone} size={20} color={DOURADO} />
                      </View>
                      <View style={styles.infoTextos}>
                        <Text style={styles.infoTitulo}>{c.titulo}</Text>
                        {c.linhas.map((l) => (
                          <Text key={l} style={styles.infoTexto}>
                            {l}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Formulário */}
              <View style={[styles.card, largo && styles.cardForm]}>
                <View style={styles.formTopo}>
                  <View style={styles.infoIcone}>
                    <Ionicons name="paper-plane-outline" size={20} color={DOURADO} />
                  </View>
                  <View style={styles.infoTextos}>
                    <Text style={styles.formTitulo}>Envie sua mensagem</Text>
                    <Text style={styles.formTexto}>
                      Preencha os campos abaixo e entraremos em contato o mais breve possível.
                    </Text>
                  </View>
                </View>

                <View style={styles.campo}>
                  <Text style={styles.rotulo}>
                    Nome completo <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#777777"
                    autoComplete="name"
                    value={nome}
                    onChangeText={setNome}
                  />
                </View>

                <View style={styles.campo}>
                  <Text style={styles.rotulo}>
                    E-mail <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#777777"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.campo}>
                  <Text style={styles.rotulo}>
                    Assunto <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <Seletor valor={assunto} opcoes={OPCOES_ASSUNTO} aoMudar={setAssunto} />
                </View>

                <View style={styles.campo}>
                  <Text style={styles.rotulo}>
                    Mensagem <Text style={styles.obrigatorio}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="Digite sua mensagem aqui..."
                    placeholderTextColor="#777777"
                    multiline
                    maxLength={LIMITE}
                    value={mensagem}
                    onChangeText={setMensagem}
                  />
                  <Text style={styles.contador}>
                    {mensagem.length}/{LIMITE}
                  </Text>
                </View>

                <Pressable style={styles.privacidade} onPress={() => setAceitou((a) => !a)}>
                  <View style={[styles.caixa, aceitou && styles.caixaMarcada]}>
                    {aceitou && <Ionicons name="checkmark" size={14} color="#1a1a1a" />}
                  </View>
                  <Text style={styles.privacidadeTexto}>
                    Li e aceito a <Text style={styles.privacidadeLink}>Política de Privacidade</Text>
                  </Text>
                </Pressable>

                {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
                {sucesso && (
                  <Text style={styles.sucesso}>
                    Mensagem enviada! Retornaremos o mais breve possível.
                  </Text>
                )}

                <Pressable style={styles.btnEnviar} onPress={enviar}>
                  <Text style={styles.btnEnviarTexto}>Enviar mensagem</Text>
                </Pressable>
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

  // Menu em abas (celular)
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

  grid: { gap: 20 },
  gridLargo: { flexDirection: 'row', alignItems: 'flex-start' },
  card: {
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 26,
  },
  cardInfo: { flex: 1 },
  cardForm: { flex: 1.2 },

  // Informações de contato
  eyebrow: { color: DOURADO, fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  cardTitulo: { color: '#ffffff', fontSize: 24, fontWeight: '800', lineHeight: 32, marginTop: 12 },
  intro: { color: '#b5b5b5', fontSize: 14, lineHeight: 23, marginTop: 12 },
  infoLista: { gap: 20, marginTop: 26 },
  infoLinha: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  infoIcone: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2a2418',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextos: { flex: 1 },
  infoTitulo: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  infoTexto: { color: '#b5b5b5', fontSize: 13, lineHeight: 21, marginTop: 2 },

  // Formulário
  formTopo: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 24 },
  formTitulo: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  formTexto: { color: '#b5b5b5', fontSize: 13, lineHeight: 21, marginTop: 4 },

  campo: { marginBottom: 18 },
  rotulo: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  obrigatorio: { color: DOURADO },
  input: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#2c2c2c',
    borderRadius: 8,
    height: 46,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 14,
  },
  textarea: { height: 150, paddingTop: 14, textAlignVertical: 'top' },
  contador: { color: '#8a8a8a', fontSize: 12, textAlign: 'right', marginTop: 6 },

  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#2c2c2c',
    borderRadius: 8,
    height: 46,
    paddingHorizontal: 16,
  },
  seletorTexto: { color: '#ffffff', fontSize: 14, flex: 1, marginRight: 8 },
  placeholder: { color: '#777777' },

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

  privacidade: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  caixa: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#555555',
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixaMarcada: { backgroundColor: DOURADO, borderColor: DOURADO },
  privacidadeTexto: { color: '#d0d0d0', fontSize: 13, flexShrink: 1 },
  privacidadeLink: { color: DOURADO },

  erro: { color: '#e57373', fontSize: 14, marginTop: 18 },
  sucesso: { color: '#8fd19e', fontSize: 14, fontWeight: 'bold', marginTop: 18 },

  btnEnviar: {
    marginTop: 22,
    backgroundColor: DOURADO_BOTAO,
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnEnviarTexto: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 15 },

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