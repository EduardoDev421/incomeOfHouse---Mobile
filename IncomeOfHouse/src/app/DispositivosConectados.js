import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
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
  green: '#0e5a3a',
  greenText: '#e8fff3',
  inactive: '#2a2a2a',
};

// Ajuste as rotas conforme os nomes dos arquivos em src/app
const MENU = [
  { label: 'Meu Perfil', icon: 'person-circle-outline', route: '/perfilProfissional' },
  { label: 'Meus Endereços', icon: 'location-outline', route: '/meusEnderecos' },
  { label: 'Meus Pedidos', icon: 'grid-outline', route: '/meusPedidos' },
  { label: 'Meus Profissionais Favoritos', icon: 'star-outline', route: '/meusProfissionais' },
  { label: 'Projetos Salvos', icon: 'bookmark-outline', route: '/projetosSalvos' },
  { label: 'Agendamentos', icon: 'calendar-outline', route: '/agendamentos' },
  { label: 'Mensagem', icon: 'chatbox-ellipses-outline', route: '/mensagem' },
  { label: 'Configurações', icon: 'settings-outline', route: '/DispositivosConectados', ativo: true },
  { label: 'Sair', icon: 'log-out-outline', route: '/login', separador: true },
];

const LINKS_TOPO = [
  ['Início', '/'],
  ['Plantas', '/planta'],
  ['Profissionais', '/profissionais'],
  ['Sobre', '/sobre'],
];

const DEVICES_INICIAIS = [
  { id: '1', titulo: 'Windows · Chrome', modelo: 'Desktop', local: 'São Paulo, SP - Brasil', acesso: 'Hoje, 15:42', ip: '177.52.34.21', ativo: true },
  { id: '2', titulo: 'iPhone · Safari', modelo: 'iPhone 15', local: 'São Paulo, SP - Brasil', acesso: 'Ontem, 21:18', ip: '177.52.34.87', ativo: true },
  { id: '3', titulo: 'iPad · Safari', modelo: 'iPad Pro', local: 'Rio de Janeiro, RJ - Brasil', acesso: '05/04/2025, 14:32', ip: '177.52.102.14', ativo: true },
  { id: '4', titulo: 'Android · Chrome', modelo: 'Samsung Galaxy S23', local: 'Curitiba, PR - Brasil', acesso: '28/03/2025, 09:17', ip: '177.52.76.33', ativo: false },
];

export default function DispositivosConectados() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [devices, setDevices] = useState(DEVICES_INICIAIS);

  const ir = (route) => {
    setMenuAberto(false);
    router.push(route);
  };

  const removerDispositivo = (device) => {
    Alert.alert(
      'Remover dispositivo',
      `Deseja remover "${device.titulo}" da sua conta?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => setDevices((prev) => prev.filter((d) => d.id !== device.id)),
        },
      ]
    );
  };

  const abrirOpcoes = (device) => {
    Alert.alert(device.titulo, 'O que deseja fazer?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover dispositivo', style: 'destructive', onPress: () => removerDispositivo(device) },
    ]);
  };

  const removerSuspeito = () => {
    Alert.alert(
      'Não reconhece algum dispositivo?',
      'Toque em "⋯" no dispositivo suspeito para removê-lo e depois altere sua senha.'
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Topo */}
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => setMenuAberto(true)} style={styles.hamburguer}>
          <Ionicons name="menu" size={26} color={COLORS.gold} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => ir('/')}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>

        <View style={{ width: 40 }} />
      </View>

      {/* Links do topo */}
      <View style={styles.menuTopo}>
        {LINKS_TOPO.map(([label, route]) => (
          <TouchableOpacity key={label} onPress={() => ir(route)}>
            <Text style={styles.menuTopoTxt}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Dispositivos Conectados</Text>
        <Text style={styles.sub}>Gerencie os dispositivos que têm acesso à sua conta.</Text>
        <View style={styles.divisor} />

        {/* Banner de segurança */}
        <View style={styles.banner}>
          <View style={styles.row}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.gold} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.bannerTitulo}>Sua conta está segura</Text>
              <Text style={styles.bannerTxt}>
                Acompanhe os dispositivos que fizeram login na sua conta e remova aqueles que você não reconhece.
              </Text>
            </View>
          </View>

          <View style={styles.bannerSep} />

          <View style={styles.row}>
            <View style={styles.badge}>
              <Ionicons name="time-outline" size={18} color={COLORS.gold} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.bannerTitulo}>Última atividade</Text>
              <Text style={styles.ultimaAtv}>Hoje, 15:42</Text>
              <Text style={styles.ultimaAtv}>(Windows • Chrome)</Text>
            </View>
          </View>
        </View>

        {/* Lista */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="desktop-outline" size={16} color={COLORS.gold} />
            <Text style={styles.cardTitulo}>Dispositivos Conectados ({devices.length})</Text>
          </View>

          {devices.map((d) => (
            <View key={d.id} style={styles.deviceRow}>
              <View style={styles.deviceTop}>
                <View style={styles.deviceIcon}>
                  <Ionicons
                    name={
                      d.titulo.startsWith('Windows')
                        ? 'desktop-outline'
                        : d.titulo.startsWith('iPad')
                        ? 'tablet-portrait-outline'
                        : 'phone-portrait-outline'
                    }
                    size={20}
                    color={COLORS.gold}
                  />
                </View>

                <View style={styles.flex}>
                  <Text style={styles.deviceTitulo}>{d.titulo}</Text>
                  <Text style={styles.deviceModelo}>{d.modelo}</Text>
                  <Text style={styles.deviceLoc}>{d.local}</Text>
                </View>

                <View style={[styles.pill, d.ativo ? styles.pillAtivo : styles.pillInativo]}>
                  <Text style={[styles.pillTxt, !d.ativo && { color: COLORS.muted }]}>
                    {d.ativo ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>

                <TouchableOpacity style={styles.rowMenu} onPress={() => abrirOpcoes(d)}>
                  <Ionicons name="ellipsis-horizontal" size={16} color={COLORS.muted} />
                </TouchableOpacity>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.flex}>
                  <Text style={styles.metaLabel}>Último acesso</Text>
                  <Text style={styles.metaValue}>{d.acesso}</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.metaLabel}>Endereço IP</Text>
                  <Text style={styles.metaValue}>{d.ip}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Aviso */}
        <View style={styles.notice}>
          <View style={styles.row}>
            <View style={styles.badge}>
              <Ionicons name="shield-outline" size={18} color={COLORS.gold} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.bannerTitulo}>Não reconhece algum dispositivo?</Text>
              <Text style={styles.bannerTxt}>
                Se você identificar algum acesso suspeito, remova o dispositivo imediatamente e altere sua senha.
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.btnDanger} onPress={removerSuspeito} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={14} color={COLORS.gold} />
            <Text style={styles.btnDangerTxt}>Remover dispositivo</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={styles.rodape}>
          <Text style={styles.rodapeTxt}>©IncomeOfHouses. Todos os direitos reservados.</Text>
          <View style={styles.rodapeLinks}>
            <TouchableOpacity onPress={() => ir('/termosUso')}>
              <Text style={styles.rodapeLink}>Termos de Uso</Text>
            </TouchableOpacity>
            <Text style={styles.rodapeSep}>|</Text>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.goldDim,
  },
  hamburguer: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
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
  divisor: { height: 1, backgroundColor: COLORS.text, marginVertical: 10, opacity: 0.9 },

  banner: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
  },
  bannerSep: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  bannerTitulo: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  bannerTxt: { color: COLORS.mutedBlue, fontSize: 11, marginTop: 2, lineHeight: 16 },
  ultimaAtv: { color: COLORS.mutedBlue, fontSize: 11, marginTop: 2 },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14 },
  cardTitulo: { color: COLORS.text, fontSize: 13, fontWeight: '700' },

  deviceRow: {
    backgroundColor: COLORS.cardAlt,
    padding: 14,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  deviceTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceTitulo: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  deviceModelo: { color: COLORS.mutedBlue, fontSize: 11, marginTop: 1 },
  deviceLoc: { color: '#5c5c5c', fontSize: 10, marginTop: 1 },

  pill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  pillAtivo: { backgroundColor: COLORS.green },
  pillInativo: { backgroundColor: COLORS.inactive },
  pillTxt: { color: COLORS.greenText, fontSize: 10, fontWeight: '600' },

  rowMenu: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  metaRow: { flexDirection: 'row', marginTop: 12, paddingLeft: 50 },
  metaLabel: { color: COLORS.muted, fontSize: 10 },
  metaValue: { color: COLORS.text, fontSize: 11, fontWeight: '700', marginTop: 2 },

  notice: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  btnDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 6,
    paddingVertical: 10,
  },
  btnDangerTxt: { color: COLORS.gold, fontSize: 12, fontWeight: '600' },

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
  rodapeSep: { color: COLORS.mutedBlue, fontSize: 10 },

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