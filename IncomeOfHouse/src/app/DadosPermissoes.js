import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Pressable,
  Alert,
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
  { label: 'Meu Perfil', icon: 'person-circle-outline', route: '/perfilUsuario' },
  { label: 'Meus Endereços', icon: 'location-outline', route: '/meusEnderecos' },
  { label: 'Meus Pedidos', icon: 'grid-outline', route: '/meusPedidos' },
  { label: 'Meus Profissionais Favoritos', icon: 'star-outline', route: '/meusProfissionais' },
  { label: 'Projetos Salvos', icon: 'bookmark-outline', route: '/projetosSalvos' },
  { label: 'Agendamentos', icon: 'calendar-outline', route: '/agendamentos' },
  { label: 'Mensagem', icon: 'chatbox-ellipses-outline', route: '/mensagem' },
  { label: 'Configurações', icon: 'settings-outline', route: '/configuracoesUsuario', ativo: true },
  { label: 'Sair', icon: 'log-out-outline', route: '/login', separador: true },
];

const LINKS_TOPO = [
  ['Início', '/'],
  ['Plantas', '/planta'],
  ['Profissionais', '/profissionais'],
  ['Sobre', '/sobre'],
];

const FUNCOES = [
  {
    key: 'admin',
    icon: 'shield-checkmark-outline',
    titulo: 'Administrador',
    desc: 'Acesso total ao sistema, incluindo configurações e gerenciamento de usuários.',
  },
  {
    key: 'gerente',
    icon: 'briefcase-outline',
    titulo: 'Gerente',
    desc: 'Acesso a projetos, profissionais e configurações (sem acesso a permissões).',
  },
  {
    key: 'editor',
    icon: 'create-outline',
    titulo: 'Editor',
    desc: 'Pode criar e editar projetos, plantas e informações da conta.',
  },
  {
    key: 'visualizador',
    icon: 'eye-outline',
    titulo: 'Visualizador',
    desc: 'Apenas visualização de projetos, plantas e informações públicas.',
  },
];

const MODULOS = [
  { key: 'plantas', icon: 'grid-outline', titulo: 'Plantas', desc: 'Acesso às plantas e projetos arquitetônicos.' },
  { key: 'profissionais', icon: 'star-outline', titulo: 'Profissionais', desc: 'Busca e contato com profissionais.' },
  { key: 'projetos', icon: 'bookmark-outline', titulo: 'Projetos', desc: 'Gerenciamento de projetos salvos.' },
  { key: 'mensagens', icon: 'chatbox-ellipses-outline', titulo: 'Mensagens', desc: 'Troca de mensagens com profissionais e clientes.' },
  { key: 'agendamentos', icon: 'calendar-outline', titulo: 'Agendamentos', desc: 'Controle de agendamentos e reuniões.' },
];

const ACOES = ['Visualizar', 'Criar', 'Editar', 'Excluir'];

const PERMISSOES_INICIAIS = {
  plantas: [true, true, true, false],
  profissionais: [true, false, false, false],
  projetos: [true, true, true, false],
  mensagens: [true, true, true, false],
  agendamentos: [true, true, true, false],
};

const FUNCOES_INICIAIS = { admin: true, gerente: true, editor: true, visualizador: false };

/* ---------- Componentes auxiliares ---------- */

function Toggle({ value, onChange }) {
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: '#2a2a2a', true: COLORS.gold }}
      thumbColor="#fff"
    />
  );
}

function CardTitulo({ icon, titulo, descricao }) {
  return (
    <View style={styles.cardTitulo}>
      <View style={styles.iconeCard}>
        <Ionicons name={icon} size={18} color={COLORS.gold} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTituloTxt}>{titulo}</Text>
        <Text style={styles.cardDescTxt}>{descricao}</Text>
      </View>
    </View>
  );
}

function InfoConta({ icon, label, valor, editando, onChange, keyboardType }) {
  return (
    <View style={styles.info}>
      <Ionicons name={icon} size={16} color={COLORS.gold} />
      <View style={styles.flex}>
        <Text style={styles.infoLabel}>{label}</Text>
        {editando && onChange ? (
          <TextInput
            style={styles.infoInput}
            value={valor}
            onChangeText={onChange}
            keyboardType={keyboardType}
            autoCapitalize="none"
          />
        ) : (
          <Text style={styles.infoValor}>{valor}</Text>
        )}
      </View>
    </View>
  );
}

/* ---------- Tela ---------- */

export default function DadosPermissoes() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState('João Silva');
  const [email, setEmail] = useState('joao@exemplo.com');
  const [telefone, setTelefone] = useState('(11) 98765-4321');

  const [funcoes, setFuncoes] = useState(FUNCOES_INICIAIS);
  const [permissoes, setPermissoes] = useState(PERMISSOES_INICIAIS);

  const ir = (route) => {
    setMenuAberto(false);
    router.push(route);
  };

  const alternarEdicao = () => {
    if (editando) {
      Alert.alert('Dados atualizados', 'Seus dados foram salvos com sucesso.');
    }
    setEditando((v) => !v);
  };

  const alternarFuncao = (key, valor) => setFuncoes((prev) => ({ ...prev, [key]: valor }));

  const alternarPermissao = (modulo, indice, valor) =>
    setPermissoes((prev) => ({
      ...prev,
      [modulo]: prev[modulo].map((v, i) => (i === indice ? valor : v)),
    }));

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

        <View style={styles.topoBtn} />
      </View>

      <View style={styles.menuTopo}>
        {LINKS_TOPO.map(([label, route]) => (
          <TouchableOpacity key={label} onPress={() => ir(route)}>
            <Text style={styles.menuTopoTxt}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Dados e Permissões</Text>
        <Text style={styles.sub}>Gerencie seus dados de acesso e as permissões da sua conta.</Text>
        <View style={styles.divisor} />

        {/* Dados da Conta */}
        <View style={styles.card}>
          <CardTitulo
            icon="id-card-outline"
            titulo="Dados da Conta"
            descricao="Informações da sua conta e acesso ao sistema."
          />

          <InfoConta icon="person-outline" label="Nome completo" valor={nome} editando={editando} onChange={setNome} />
          <InfoConta
            icon="mail-outline"
            label="E-mail"
            valor={email}
            editando={editando}
            onChange={setEmail}
            keyboardType="email-address"
          />
          <InfoConta
            icon="call-outline"
            label="Telefone"
            valor={telefone}
            editando={editando}
            onChange={setTelefone}
            keyboardType="phone-pad"
          />
          <InfoConta icon="person-circle-outline" label="Tipo de conta" valor="Cliente" />

          <TouchableOpacity style={styles.botaoOutline} onPress={alternarEdicao} activeOpacity={0.8}>
            <Ionicons name={editando ? 'checkmark' : 'create-outline'} size={16} color={COLORS.gold} />
            <Text style={styles.botaoOutlineTxt}>{editando ? 'Salvar dados' : 'Editar dados'}</Text>
          </TouchableOpacity>
        </View>

        {/* Funções e Permissões */}
        <View style={styles.card}>
          <CardTitulo
            icon="settings-outline"
            titulo="Funções e Permissões"
            descricao="Configure as permissões de acesso da sua conta."
          />

          {FUNCOES.map((f, i) => (
            <View key={f.key} style={[styles.roleRow, i === FUNCOES.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.roleIcone}>
                <Ionicons name={f.icon} size={18} color={COLORS.gold} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.roleTitulo}>{f.titulo}</Text>
                <Text style={styles.roleDesc}>{f.desc}</Text>
              </View>
              <Toggle value={funcoes[f.key]} onChange={(v) => alternarFuncao(f.key, v)} />
            </View>
          ))}
        </View>

        {/* Permissões por Módulo */}
        <View style={styles.card}>
          <CardTitulo
            icon="albums-outline"
            titulo="Permissões por Módulo"
            descricao="Defina quais módulos o usuário pode acessar e quais ações estão liberadas."
          />

          {MODULOS.map((m, i) => (
            <View key={m.key} style={[styles.modulo, i === MODULOS.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.moduloTop}>
                <View style={styles.roleIcone}>
                  <Ionicons name={m.icon} size={18} color={COLORS.gold} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.roleTitulo}>{m.titulo}</Text>
                  <Text style={styles.roleDesc}>{m.desc}</Text>
                </View>
              </View>

              <View style={styles.acoesRow}>
                {ACOES.map((acao, idx) => (
                  <View key={acao} style={styles.acao}>
                    <Text style={styles.acaoLabel}>{acao}</Text>
                    <Toggle
                      value={permissoes[m.key][idx]}
                      onChange={(v) => alternarPermissao(m.key, idx, v)}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
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

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },
  cardTitulo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconeCard: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTituloTxt: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  cardDescTxt: { color: COLORS.mutedBlue, fontSize: 11, marginTop: 2, lineHeight: 15 },

  // Dados da conta
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  infoLabel: { color: COLORS.muted, fontSize: 10 },
  infoValor: { color: COLORS.text, fontSize: 13, fontWeight: '700', marginTop: 2 },
  infoInput: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    padding: 0,
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.goldDim,
  },

  botaoOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 11,
    marginTop: 6,
  },
  botaoOutlineTxt: { color: COLORS.gold, fontSize: 12, fontWeight: '600' },

  // Funções
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roleIcone: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitulo: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  roleDesc: { color: COLORS.mutedBlue, fontSize: 10, marginTop: 2, lineHeight: 14 },

  // Módulos
  modulo: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moduloTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  acoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  acao: { flex: 1, alignItems: 'center', gap: 2 },
  acaoLabel: { color: COLORS.muted, fontSize: 10 },

  // Rodapé
  rodape: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    marginHorizontal: -16,
    marginTop: 6,
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