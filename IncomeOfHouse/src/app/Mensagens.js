import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const LOGO = require('../../assets/images/Logo.png');

const COLORS = {
  bg: '#0a0a0a',
  card: '#121212',
  cardAlt: '#161616',
  border: '#2a2a2a',
  gold: '#d9a520',
  goldDim: 'rgba(217,165,32,0.45)',
  text: '#ffffff',
  muted: '#8a8a8a',
  mutedBlue: '#7f9bb5',
};

// Ajuste as rotas conforme os nomes dos arquivos em src/app
const MENU = [
  { label: 'Meu Perfil', icon: 'person-circle-outline', route: '/perfilProfissional' },
  { label: 'Meus Endereços', icon: 'location-outline', route: '/meusEnderecos' },
  { label: 'Meus Pedidos', icon: 'grid-outline', route: '/meusPedidos' },
  { label: 'Meus Profissionais Favoritos', icon: 'star-outline', route: '/meusProfissionais' },
  { label: 'Projetos Salvos', icon: 'bookmark-outline', route: '/projetosSalvos' },
  { label: 'Agendamentos', icon: 'calendar-outline', route: '/agendamentos' },
  { label: 'Mensagem', icon: 'chatbox-ellipses-outline', route: '/mensagem', ativo: true },
  { label: 'Configurações', icon: 'settings-outline', route: '/configuracoesProfissionais' },
  { label: 'Sair', icon: 'log-out-outline', route: '/login', separador: true },
];

const LINKS_TOPO = [
  ['Início', '/'],
  ['Plantas', '/planta'],
  ['Profissionais', '/profissionais'],
  ['Sobre Nós', '/sobre'],
];

const CONVERSAS_INICIAIS = [
  {
    id: '1',
    nome: 'João Silva',
    iniciais: 'JS',
    funcao: 'Profissional',
    preview: 'Olá, gostaria de saber mais sobre...',
    hora: '14:30',
    mensagens: [
      { id: 'm1', tipo: 'recebida', texto: 'Olá! Tudo bem?', hora: '14:28' },
      { id: 'm2', tipo: 'recebida', texto: 'Gostaria de saber mais sobre o projeto da casa moderna.', hora: '14:29' },
      { id: 'm3', tipo: 'enviada', texto: 'Olá, tudo bem sim! Claro, posso te passar mais informações.', hora: '14:30' },
      { id: 'm4', tipo: 'recebida', texto: 'Perfeito, obrigado!', hora: '14:30' },
    ],
  },
  {
    id: '2',
    nome: 'Marcos Costa',
    iniciais: 'MC',
    funcao: 'Profissional',
    preview: 'Podemos marcar uma reunião?',
    hora: 'Ontem',
    mensagens: [{ id: 'm1', tipo: 'recebida', texto: 'Podemos marcar uma reunião?', hora: '18:12' }],
  },
  {
    id: '3',
    nome: 'Ana Souza',
    iniciais: 'AS',
    funcao: 'Profissional',
    preview: 'Enviei os detalhes do projeto.',
    hora: '17/05',
    mensagens: [{ id: 'm1', tipo: 'recebida', texto: 'Enviei os detalhes do projeto.', hora: '10:05' }],
  },
  {
    id: '4',
    nome: 'Ricardo Costa',
    iniciais: 'RC',
    funcao: 'Profissional',
    preview: 'Obrigado pelo contato!',
    hora: '16/05',
    mensagens: [{ id: 'm1', tipo: 'recebida', texto: 'Obrigado pelo contato!', hora: '16:40' }],
  },
];

const horaAtual = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/* ---------- Componentes auxiliares ---------- */

function Avatar({ iniciais, grande }) {
  return (
    <View style={[styles.avatar, grande && styles.avatarGrande]}>
      <Text style={[styles.avatarTxt, grande && { fontSize: 15 }]}>{iniciais}</Text>
    </View>
  );
}

/* ---------- Tela ---------- */

export default function Mensagens() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  const [conversas, setConversas] = useState(CONVERSAS_INICIAIS);
  const [conversaId, setConversaId] = useState(null); // null = lista
  const [busca, setBusca] = useState('');
  const [texto, setTexto] = useState('');
  const scrollRef = useRef(null);

  const conversaAtual = useMemo(() => conversas.find((c) => c.id === conversaId) || null, [conversas, conversaId]);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return conversas;
    return conversas.filter((c) => c.nome.toLowerCase().includes(termo) || c.preview.toLowerCase().includes(termo));
  }, [busca, conversas]);

  // Botão voltar do Android fecha o chat
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (conversaId) {
        setConversaId(null);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [conversaId]);

  const ir = (route) => {
    setMenuAberto(false);
    router.push(route);
  };

  const enviar = () => {
    const conteudo = texto.trim();
    if (!conteudo || !conversaAtual) return;

    const hora = horaAtual();
    const nova = { id: `m${Date.now()}`, tipo: 'enviada', texto: conteudo, hora };

    setConversas((prev) =>
      prev.map((c) =>
        c.id === conversaAtual.id ? { ...c, mensagens: [...c.mensagens, nova], preview: conteudo, hora } : c
      )
    );
    setTexto('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Topo */}
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => setMenuAberto(true)} style={styles.topoBtn}>
          <Ionicons name="menu" size={26} color={COLORS.gold} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => ir('/')}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => ir('/perfilProfissional')} style={styles.topoBtn}>
          <Ionicons name="person-circle-outline" size={26} color={COLORS.gold} />
        </TouchableOpacity>
      </View>

      {!conversaAtual ? (
        /* ========== LISTA DE CONVERSAS ========== */
        <>
          <View style={styles.menuTopo}>
            {LINKS_TOPO.map(([label, route]) => (
              <TouchableOpacity key={label} onPress={() => ir(route)}>
                <Text style={styles.menuTopoTxt}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.h1}>Mensagens</Text>
            <Text style={styles.sub}>Gerencie suas conversas e mensagens.</Text>
            <View style={styles.divisor} />

            <View style={styles.card}>
              <View style={styles.buscar}>
                <TextInput
                  style={styles.buscarInput}
                  placeholder="Buscar mensagem..."
                  placeholderTextColor={COLORS.muted}
                  value={busca}
                  onChangeText={setBusca}
                  returnKeyType="search"
                />
                {busca ? (
                  <TouchableOpacity onPress={() => setBusca('')}>
                    <Ionicons name="close-circle" size={18} color={COLORS.muted} />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="search" size={18} color={COLORS.gold} />
                )}
              </View>

              {filtradas.length === 0 ? (
                <Text style={styles.vazio}>Nenhuma conversa encontrada.</Text>
              ) : (
                filtradas.map((c, i) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.conversa, i === filtradas.length - 1 && { borderBottomWidth: 0 }]}
                    onPress={() => setConversaId(c.id)}
                    activeOpacity={0.8}
                  >
                    <Avatar iniciais={c.iniciais} />
                    <View style={styles.flex}>
                      <Text style={styles.conversaNome}>{c.nome}</Text>
                      <Text style={styles.conversaPreview} numberOfLines={1}>
                        {c.preview}
                      </Text>
                    </View>
                    <Text style={styles.conversaHora}>{c.hora}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Rodapé */}
            <View style={styles.rodape}>
              <Text style={styles.rodapeTxt}>©IncomeOfHouses. Todos os direitos reservados.</Text>
              <View style={styles.rodapeLinks}>
                <TouchableOpacity onPress={() => ir('/termosUso')}>
                  <Text style={styles.rodapeLink}>Termos de Uso</Text>
                </TouchableOpacity>
                <Text style={styles.rodapeLink}>|</Text>
                <TouchableOpacity onPress={() => ir('/politicaPrivacidade')}>
                  <Text style={styles.rodapeLink}>Política de Privacidade</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      ) : (
        /* ========== CHAT ========== */
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.chatTopo}>
            <TouchableOpacity onPress={() => setConversaId(null)} style={styles.voltarBtn}>
              <Ionicons name="arrow-back" size={22} color={COLORS.gold} />
            </TouchableOpacity>
            <Avatar iniciais={conversaAtual.iniciais} grande />
            <View style={styles.flex}>
              <Text style={styles.chatNome}>{conversaAtual.nome}</Text>
              <Text style={styles.chatFuncao}>{conversaAtual.funcao}</Text>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={styles.chatConteudo}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {conversaAtual.mensagens.map((m) => {
              const enviada = m.tipo === 'enviada';
              return (
                <View key={m.id} style={[styles.mensagem, enviada ? styles.enviada : styles.recebida]}>
                  <Text style={[styles.mensagemTxt, enviada && { color: '#0a0a0a' }]}>{m.texto}</Text>
                  <Text style={[styles.mensagemHora, enviada && { color: 'rgba(10,10,10,0.6)' }]}>{m.hora}</Text>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.campoMensagem}>
            <TextInput
              style={styles.campoInput}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={COLORS.muted}
              value={texto}
              onChangeText={setTexto}
              multiline
              onSubmitEditing={enviar}
            />
            <TouchableOpacity
              style={[styles.btnEnviar, !texto.trim() && { opacity: 0.4 }]}
              onPress={enviar}
              disabled={!texto.trim()}
              activeOpacity={0.85}
            >
              <Text style={styles.btnEnviarTxt}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Menu lateral */}
      <Modal visible={menuAberto} transparent animationType="fade" onRequestClose={() => setMenuAberto(false)}>
        <View style={styles.modalRoot}>
          <SafeAreaView style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <TouchableOpacity onPress={() => setMenuAberto(false)}>
                <Ionicons name="close" size={24} color={COLORS.gold} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {MENU.map((item) => (
                <View key={item.label}>
                  {item.separador && <View style={styles.drawerSep} />}
                  <TouchableOpacity
                    style={[styles.menuItem, item.ativo && styles.menuItemAtivo]}
                    onPress={() => ir(item.route)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={item.icon} size={16} color={item.ativo ? COLORS.gold : COLORS.muted} />
                    <Text style={[styles.menuItemTxt, item.ativo && { color: COLORS.gold }]}>{item.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
          <Pressable style={styles.overlay} onPress={() => setMenuAberto(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },

  // Topo
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.goldDim,
  },
  topoBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 80, height: 40 },
  menuTopo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuTopoTxt: { color: COLORS.text, fontSize: 12, fontWeight: '600' },

  scroll: { padding: 16, paddingBottom: 0 },
  h1: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  sub: { color: COLORS.text, fontSize: 12, marginTop: 4 },
  divisor: { height: 1, backgroundColor: COLORS.text, marginVertical: 12, opacity: 0.9 },

  // Lista
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  buscar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 6,
  },
  buscarInput: { flex: 1, color: COLORS.text, fontSize: 13, padding: 0 },
  vazio: { color: COLORS.muted, fontSize: 12, textAlign: 'center', paddingVertical: 24 },

  conversa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  conversaNome: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  conversaPreview: { color: COLORS.mutedBlue, fontSize: 11, marginTop: 2 },
  conversaHora: { color: COLORS.muted, fontSize: 10 },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGrande: { width: 44, height: 44, borderRadius: 22 },
  avatarTxt: { color: COLORS.gold, fontSize: 12, fontWeight: '700' },

  // Chat
  chatTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  voltarBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  chatNome: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  chatFuncao: { color: COLORS.mutedBlue, fontSize: 11, marginTop: 1 },
  chatConteudo: { padding: 16, gap: 10 },

  mensagem: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  recebida: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 2,
  },
  enviada: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.gold,
    borderBottomRightRadius: 2,
  },
  mensagemTxt: { color: COLORS.text, fontSize: 13, lineHeight: 18 },
  mensagemHora: { color: COLORS.muted, fontSize: 9, marginTop: 4, alignSelf: 'flex-end' },

  campoMensagem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  campoInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 44,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    color: COLORS.text,
    fontSize: 13,
  },
  btnEnviar: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnEnviarTxt: { color: '#0a0a0a', fontSize: 13, fontWeight: '700' },

  // Rodapé
  rodape: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    marginHorizontal: -16,
  },
  rodapeTxt: { color: COLORS.muted, fontSize: 10 },
  rodapeLinks: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rodapeLink: { color: COLORS.mutedBlue, fontSize: 10 },

  // Drawer
  modalRoot: { flex: 1, flexDirection: 'row' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  drawer: {
    width: 260,
    backgroundColor: COLORS.bg,
    borderRightWidth: 1,
    borderRightColor: COLORS.goldDim,
    paddingHorizontal: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 6,
  },
  drawerSep: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  menuItemAtivo: { borderColor: COLORS.gold, backgroundColor: 'rgba(217,165,32,0.08)' },
  menuItemTxt: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
});