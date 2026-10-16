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
import * as DocumentPicker from 'expo-document-picker';

const DOURADO = '#c9a45c';
const DOURADO_BOTAO = '#d9b45f';
const LIMITE_DESCRICAO = 500;

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
/* OPÇÕES DOS SELETORES                                                */
/* ------------------------------------------------------------------ */
const opcoes = (titulo, lista) => [
  { label: titulo, valor: '' },
  ...lista.map((l) => ({ label: l, valor: l })),
];

const OPCOES_TIPO = opcoes('Selecione o tipo de profissional', ['Engenheiro', 'Arquiteto', 'Advogado']);

const OPCOES_ESTADO = opcoes('Selecione o estado', [
  'Acre (AC)', 'Alagoas (AL)', 'Amapá (AP)', 'Amazonas (AM)', 'Bahia (BA)', 'Ceará (CE)',
  'Distrito Federal (DF)', 'Espírito Santo (ES)', 'Goiás (GO)', 'Maranhão (MA)', 'Mato Grosso (MT)',
  'Mato Grosso do Sul (MS)', 'Minas Gerais (MG)', 'Pará (PA)', 'Paraíba (PB)', 'Paraná (PR)',
  'Pernambuco (PE)', 'Piauí (PI)', 'Rio de Janeiro (RJ)', 'Rio Grande do Norte (RN)',
  'Rio Grande do Sul (RS)', 'Rondônia (RO)', 'Roraima (RR)', 'Santa Catarina (SC)',
  'São Paulo (SP)', 'Sergipe (SE)', 'Tocantins (TO)',
]);

const OPCOES_AREA = opcoes('Selecione a área de atuação', [
  'Construção Civil', 'Arquitetura', 'Engenharia', 'Design de Interiores',
]);

/* ------------------------------------------------------------------ */
/* VANTAGENS E PASSOS                                                  */
/* ------------------------------------------------------------------ */
const VANTAGENS = [
  { titulo: 'Mais visibilidade', texto: 'Seus projetos serão vistos por milhares de usuários.' },
  { titulo: 'Novas oportunidades', texto: 'Conecte-se com clientes e projetos em todo o Brasil.' },
  { titulo: 'Gestão simplificada', texto: 'Acompanhe seus atendimentos e pedidos em um só lugar.' },
  { titulo: 'Credibilidade', texto: 'Faça parte de uma plataforma segura e confiável.' },
];

const PASSOS = [
  { titulo: 'Preencha seus dados', texto: 'Informe suas informações pessoais e profissionais.' },
  { titulo: 'Anexe os documentos', texto: 'Envie a documentação necessária para verificação.' },
  { titulo: 'Aguarde a análise', texto: 'Nossa equipe irá revisar seus dados em até 3 dias úteis.' },
  { titulo: 'Comece a receber solicitações', texto: 'Após a aprovação, seu perfil estará ativo na plataforma.' },
];

/* ------------------------------------------------------------------ */
/* MÁSCARAS E VALIDAÇÕES                                               */
/* ------------------------------------------------------------------ */
const soDigitos = (t) => t.replace(/\D/g, '');

function mascaraCpfCnpj(texto) {
  const d = soDigitos(texto).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function mascaraTelefone(texto) {
  const d = soDigitos(texto).slice(0, 11);
  if (d.length > 6) {
    const corte = d.length > 10 ? 7 : 6;
    return `(${d.slice(0, 2)}) ${d.slice(2, corte)}-${d.slice(corte)}`;
  }
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return d;
}

function mascaraData(texto) {
  const d = soDigitos(texto).slice(0, 8);
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
}

const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

function dataValida(texto) {
  const d = soDigitos(texto);
  if (d.length !== 8) return false;
  const dia = Number(d.slice(0, 2));
  const mes = Number(d.slice(2, 4));
  const ano = Number(d.slice(4));
  return dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12 && ano >= 1900 && ano <= new Date().getFullYear();
}

const formatarTamanho = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ------------------------------------------------------------------ */
/* COMPONENTES                                                         */
/* ------------------------------------------------------------------ */
function Campo({ rotulo, icone, duas, ...resto }) {
  return (
    <View style={[styles.campo, duas && styles.campoMetade]}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={styles.caixaInput}>
        <Ionicons name={icone} size={18} color={DOURADO} />
        <TextInput style={styles.input} placeholderTextColor="#777777" {...resto} />
      </View>
    </View>
  );
}

function Seletor({ rotulo, icone, valor, lista, aoMudar, duas }) {
  const [aberto, setAberto] = useState(false);
  const atual = lista.find((o) => o.valor === valor) || lista[0];

  return (
    <View style={[styles.campo, duas && styles.campoMetade]}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <Pressable style={styles.caixaInput} onPress={() => setAberto(true)}>
        <Ionicons name={icone} size={18} color={DOURADO} />
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
            <Text style={styles.modalTitulo}>{rotulo.replace(' *', '')}</Text>
            <ScrollView>
              {lista.map((o, i) => (
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

function TituloCard({ numero, texto }) {
  return (
    <View style={styles.cardTituloLinha}>
      <View style={styles.numero}>
        <Text style={styles.numeroTexto}>{numero}</Text>
      </View>
      <Text style={styles.cardTitulo}>{texto}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* TELA                                                                */
/* ------------------------------------------------------------------ */
export default function RegistroProfissional() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const largo = width >= 1000;
  const topoLargo = width >= 900;
  const muitoLargo = width >= 1300;
  const duas = width >= 700;

  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [tipo, setTipo] = useState('');
  const [registro, setRegistro] = useState('');
  const [estadoRegistro, setEstadoRegistro] = useState('');
  const [area, setArea] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivos, setArquivos] = useState([]);

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const navegar = (rota) => router.push(rota);

  const selecionarArquivos = async () => {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (resultado.canceled) return;
    setArquivos((lista) => {
      const novos = resultado.assets.filter((a) => !lista.some((x) => x.uri === a.uri));
      return [...lista, ...novos];
    });
  };

  const removerArquivo = (uri) => setArquivos((lista) => lista.filter((a) => a.uri !== uri));

  const enviar = () => {
    setSucesso(false);

    const docDigitos = soDigitos(cpfCnpj).length;

    if (!nome.trim()) return setErro('Informe seu nome completo.');
    if (docDigitos !== 11 && docDigitos !== 14) return setErro('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.');
    if (!emailValido(email)) return setErro('Informe um e-mail válido.');
    if (soDigitos(telefone).length < 10) return setErro('Informe um telefone válido com DDD.');
    if (!dataValida(nascimento)) return setErro('Informe a data no formato dd/mm/aaaa.');
    if (!tipo) return setErro('Selecione o tipo de profissional.');
    if (!registro.trim()) return setErro('Informe seu registro profissional.');
    if (!estadoRegistro) return setErro('Selecione o estado do registro.');
    if (!area) return setErro('Selecione a área de atuação.');
    if (!experiencia) return setErro('Informe seus anos de experiência.');
    if (!descricao.trim()) return setErro('Escreva a descrição profissional.');
    if (arquivos.length === 0) return setErro('Anexe pelo menos um documento.');

    setErro('');

    const solicitacao = {
      nome: nome.trim(),
      cpfCnpj,
      email: email.trim(),
      telefone,
      nascimento,
      tipo,
      registro: registro.trim(),
      estadoRegistro,
      area,
      experiencia: Number(experiencia),
      descricao: descricao.trim(),
      arquivos, // [{ uri, name, size, mimeType }]
    };

    // TODO: enviar "solicitacao" (e os arquivos) para o seu backend aqui.
    console.log('Solicitação pronta para enviar:', solicitacao);

    setSucesso(true);
    setNome('');
    setCpfCnpj('');
    setEmail('');
    setTelefone('');
    setNascimento('');
    setTipo('');
    setRegistro('');
    setEstadoRegistro('');
    setArea('');
    setExperiencia('');
    setDescricao('');
    setArquivos([]);
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
            <Text style={[styles.titulo, !largo && styles.tituloEstreito]}>
              Registro de Profissional
            </Text>
            <Text style={styles.subtitulo}>
              Complete seus dados para se tornar um profissional da plataforma.
            </Text>

            <View style={[styles.grid, muitoLargo && styles.gridLargo]}>
              {/* ===== FORMULÁRIO ===== */}
              <View style={styles.formulario}>
                {/* 1 - Informações pessoais */}
                <View style={styles.card}>
                  <TituloCard numero="1" texto="Informações Pessoais" />
                  <View style={styles.campos}>
                    <Campo
                      rotulo="Nome completo *"
                      icone="person-outline"
                      duas={duas}
                      placeholder="Digite seu nome completo"
                      value={nome}
                      onChangeText={setNome}
                    />
                    <Campo
                      rotulo="CPF/CNPJ *"
                      icone="card-outline"
                      duas={duas}
                      placeholder="Digite seu CPF ou CNPJ"
                      keyboardType="numeric"
                      value={cpfCnpj}
                      onChangeText={(t) => setCpfCnpj(mascaraCpfCnpj(t))}
                    />
                    <Campo
                      rotulo="E-mail *"
                      icone="mail-outline"
                      duas={duas}
                      placeholder="Digite seu e-mail"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                    <Campo
                      rotulo="Telefone *"
                      icone="call-outline"
                      duas={duas}
                      placeholder="(11) 98765-4321"
                      keyboardType="phone-pad"
                      value={telefone}
                      onChangeText={(t) => setTelefone(mascaraTelefone(t))}
                    />
                    <Campo
                      rotulo="Data de nascimento / Fundação *"
                      icone="calendar-outline"
                      duas={duas}
                      placeholder="dd/mm/aaaa"
                      keyboardType="numeric"
                      value={nascimento}
                      onChangeText={(t) => setNascimento(mascaraData(t))}
                    />
                    <Seletor
                      rotulo="Tipo de profissional *"
                      icone="business-outline"
                      duas={duas}
                      valor={tipo}
                      lista={OPCOES_TIPO}
                      aoMudar={setTipo}
                    />
                  </View>
                </View>

                {/* 2 - Dados profissionais */}
                <View style={styles.card}>
                  <TituloCard numero="2" texto="Dados Profissionais" />
                  <View style={styles.campos}>
                    <Campo
                      rotulo="Registro Profissional (CREA/CAU/etc.) *"
                      icone="ribbon-outline"
                      duas={duas}
                      placeholder="Digite seu registro"
                      value={registro}
                      onChangeText={setRegistro}
                    />
                    <Seletor
                      rotulo="Estado do registro *"
                      icone="location-outline"
                      duas={duas}
                      valor={estadoRegistro}
                      lista={OPCOES_ESTADO}
                      aoMudar={setEstadoRegistro}
                    />
                    <Seletor
                      rotulo="Área de atuação *"
                      icone="briefcase-outline"
                      duas={duas}
                      valor={area}
                      lista={OPCOES_AREA}
                      aoMudar={setArea}
                    />
                    <Campo
                      rotulo="Experiência (anos) *"
                      icone="time-outline"
                      duas={duas}
                      placeholder="Ex.: 5 anos"
                      keyboardType="numeric"
                      value={experiencia}
                      onChangeText={(t) => setExperiencia(soDigitos(t).slice(0, 2))}
                    />

                    <View style={styles.campo}>
                      <Text style={styles.rotulo}>Descrição profissional *</Text>
                      <View style={[styles.caixaInput, styles.caixaTextarea]}>
                        <Ionicons name="pencil-outline" size={18} color={DOURADO} style={styles.iconeTopo} />
                        <TextInput
                          style={[styles.input, styles.textarea]}
                          placeholder="Conte um pouco sobre sua experiência e especializações..."
                          placeholderTextColor="#777777"
                          multiline
                          maxLength={LIMITE_DESCRICAO}
                          value={descricao}
                          onChangeText={setDescricao}
                        />
                      </View>
                      <Text style={styles.contador}>
                        {descricao.length}/{LIMITE_DESCRICAO}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 3 - Documentos */}
                <View style={styles.card}>
                  <TituloCard numero="3" texto="Documentos" />

                  <View style={styles.upload}>
                    <Ionicons name="cloud-upload-outline" size={34} color={DOURADO} />
                    <View style={styles.uploadTextos}>
                      <Text style={styles.uploadTitulo}>
                        Anexe seus documentos (PDF, JPG ou PNG)
                      </Text>
                      <Text style={styles.uploadSub}>
                        RG, CPF, Comprovante de endereço, Registro profissional e Portfólio
                        (opcional)
                      </Text>
                    </View>
                    <Pressable style={styles.btnSelecionar} onPress={selecionarArquivos}>
                      <Text style={styles.btnSelecionarTexto}>Selecionar arquivos</Text>
                    </Pressable>
                  </View>

                  {arquivos.length > 0 && (
                    <View style={styles.arquivos}>
                      {arquivos.map((a) => (
                        <View key={a.uri} style={styles.arquivo}>
                          <Ionicons
                            name={a.mimeType === 'application/pdf' ? 'document-text-outline' : 'image-outline'}
                            size={20}
                            color={DOURADO}
                          />
                          <View style={styles.arquivoTextos}>
                            <Text style={styles.arquivoNome} numberOfLines={1}>
                              {a.name}
                            </Text>
                            {!!a.size && (
                              <Text style={styles.arquivoTamanho}>{formatarTamanho(a.size)}</Text>
                            )}
                          </View>
                          <Pressable onPress={() => removerArquivo(a.uri)} hitSlop={8}>
                            <Ionicons name="close" size={18} color="#b5b5b5" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}

                  {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
                  {sucesso && (
                    <Text style={styles.sucesso}>
                      Solicitação enviada! Nossa equipe analisará seus dados em até 3 dias
                      úteis.
                    </Text>
                  )}

                  <Pressable style={styles.btnEnviar} onPress={enviar}>
                    <Text style={styles.btnEnviarTexto}>Enviar solicitação</Text>
                  </Pressable>
                </View>
              </View>

              {/* ===== COLUNA DIREITA ===== */}
              <View style={[styles.lado, muitoLargo && styles.ladoLargo]}>
                {/* Vantagens */}
                <View style={styles.card}>
                  <View style={styles.cardTituloLinha}>
                    <Ionicons name="star-outline" size={22} color={DOURADO} />
                    <Text style={[styles.cardTitulo, styles.flexUm]}>
                      Vantagens de ser um profissional
                    </Text>
                  </View>
                  <Text style={styles.descricaoLado}>
                    Faça parte de uma rede de especialistas em projetos e construção.
                  </Text>

                  {VANTAGENS.map((v) => (
                    <View key={v.titulo} style={styles.vantagem}>
                      <Text style={styles.vantagemTitulo}>{v.titulo}</Text>
                      <Text style={styles.vantagemTexto}>{v.texto}</Text>
                    </View>
                  ))}
                </View>

                {/* Como funciona */}
                <View style={styles.card}>
                  <View style={styles.cardTituloLinha}>
                    <Ionicons name="reader-outline" size={22} color={DOURADO} />
                    <Text style={[styles.cardTitulo, styles.flexUm]}>Como funciona?</Text>
                  </View>

                  {PASSOS.map((p, i) => (
                    <View key={p.titulo} style={styles.passo}>
                      <View style={styles.passoNumero}>
                        <Text style={styles.passoNumeroTexto}>{i + 1}</Text>
                      </View>
                      <View style={styles.flexUm}>
                        <Text style={styles.vantagemTitulo}>{p.titulo}</Text>
                        <Text style={styles.vantagemTexto}>{p.texto}</Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.suporte}>
                    <Text style={styles.suporteTexto}>
                      Em caso de dúvidas, entre em contato com nosso suporte pelo menu{' '}
                      <Text style={styles.suporteLink} onPress={() => navegar('/faleConosco')}>
                        Fale Conosco
                      </Text>
                      .
                    </Text>
                  </View>
                </View>
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
  flexUm: { flex: 1 },

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
    maxWidth: 1400,
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

  grid: { gap: 20 },
  gridLargo: { flexDirection: 'row', alignItems: 'flex-start' },
  formulario: { flex: 1, gap: 20 },
  lado: { gap: 20 },
  ladoLargo: { width: 360 },

  card: {
    backgroundColor: 'rgba(16, 16, 16, 0.94)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 24,
  },
  cardTituloLinha: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  cardTitulo: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  numero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DOURADO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTexto: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 14 },

  // Campos
  campos: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 18, rowGap: 18 },
  campo: { width: '100%' },
  campoMetade: { width: '48.5%' },
  rotulo: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  caixaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#2c2c2c',
    borderRadius: 8,
    height: 46,
    paddingHorizontal: 14,
  },
  input: { flex: 1, height: '100%', color: '#ffffff', fontSize: 14 },
  seletorTexto: { flex: 1, color: '#ffffff', fontSize: 14 },
  placeholder: { color: '#777777' },

  caixaTextarea: { height: 130, alignItems: 'flex-start', paddingTop: 14 },
  iconeTopo: { marginTop: 2 },
  textarea: { paddingTop: 0, textAlignVertical: 'top' },
  contador: { color: '#8a8a8a', fontSize: 12, textAlign: 'right', marginTop: 6 },

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

  // Documentos
  upload: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#101010',
    padding: 20,
  },
  uploadTextos: { flex: 1, minWidth: 200 },
  uploadTitulo: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  uploadSub: { color: '#a8a8a8', fontSize: 12, lineHeight: 19, marginTop: 4 },
  btnSelecionar: {
    borderWidth: 1,
    borderColor: DOURADO,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  btnSelecionarTexto: { color: DOURADO, fontWeight: 'bold', fontSize: 13 },

  arquivos: { gap: 10, marginTop: 16 },
  arquivo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  arquivoTextos: { flex: 1 },
  arquivoNome: { color: '#ffffff', fontSize: 13 },
  arquivoTamanho: { color: '#8a8a8a', fontSize: 11, marginTop: 2 },

  erro: { color: '#e57373', fontSize: 14, marginTop: 18 },
  sucesso: { color: '#8fd19e', fontSize: 14, fontWeight: 'bold', marginTop: 18, lineHeight: 21 },

  btnEnviar: {
    marginTop: 22,
    backgroundColor: DOURADO_BOTAO,
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnEnviarTexto: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 15 },

  // Coluna direita
  descricaoLado: { color: '#b5b5b5', fontSize: 13, lineHeight: 21, marginTop: -8, marginBottom: 6 },
  vantagem: { marginTop: 16 },
  vantagemTitulo: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  vantagemTexto: { color: '#b5b5b5', fontSize: 13, lineHeight: 21, marginTop: 3 },

  passo: { flexDirection: 'row', gap: 14, marginTop: 16 },
  passoNumero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DOURADO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passoNumeroTexto: { color: DOURADO, fontWeight: 'bold', fontSize: 13 },

  suporte: {
    marginTop: 22,
    backgroundColor: '#1c1a14',
    borderWidth: 1,
    borderColor: '#4a3f26',
    borderRadius: 10,
    padding: 14,
  },
  suporteTexto: { color: '#d0d0d0', fontSize: 13, lineHeight: 21 },
  suporteLink: { color: DOURADO, fontWeight: 'bold' },

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