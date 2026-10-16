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
import * as ImagePicker from 'expo-image-picker';

const DOURADO = '#c9a45c';
const DOURADO_BOTAO = '#d9b45f';

const FUNDO = require('../../assets/images/BackgroundFundo.png');

/* ------------------------------------------------------------------ */
/* OPÇÕES (iguais às do site)                                          */
/* ------------------------------------------------------------------ */
const GRUPOS_CATEGORIA = {
  Residencial: ['Casa Térrea', 'Sobrado', 'Casa Geminada', 'Casa de Condomínio', 'Casa de Campo', 'Casa de Praia', 'Chácara', 'Sítio', 'Fazenda'],
  Apartamentos: ['Apartamento', 'Kitnet / Studio', 'Loft', 'Cobertura'],
  'Construções Especiais': ['Edícula', 'Casa de Madeira', 'Casa Pré-Fabricada', 'Casa Modular'],
  Comercial: ['Loja', 'Sala Comercial', 'Escritório', 'Galpão', 'Prédio Comercial'],
  Industrial: ['Galpão Industrial', 'Fábrica', 'Centro de Distribuição'],
  Lazer: ['Área de Lazer', 'Espaço Gourmet', 'Salão de Festas', 'Área de Piscina'],
  Projetos: ['Projeto Residencial', 'Projeto Comercial', 'Projeto Industrial', 'Projeto Arquitetônico'],
};

const OPCOES_CATEGORIA = [{ label: 'Selecione', valor: '' }];
Object.keys(GRUPOS_CATEGORIA).forEach((grupo) => {
  OPCOES_CATEGORIA.push({ grupo });
  GRUPOS_CATEGORIA[grupo].forEach((c) => OPCOES_CATEGORIA.push({ label: c, valor: c }));
});

const OPCOES_ESTILO = [
  { label: 'Selecione', valor: '' },
  ...['Moderno', 'Contemporâneo', 'Clássico', 'Rústico', 'Minimalista', 'Colonial'].map((e) => ({
    label: e,
    valor: e,
  })),
];

const DESTAQUES_INICIAIS = [
  'Suíte com closet',
  'Sala e cozinha integradas',
  'Área gourmet',
  'Piscina',
  'Pé-direito duplo',
  'Varanda',
  'Escritório',
  'Lavanderia',
];

const soNumeros = (t) => t.replace(/[^0-9]/g, '');
const numeroDecimal = (t) => t.replace(/[^0-9.,]/g, '');

/* ------------------------------------------------------------------ */
/* COMPONENTE: SELETOR (substitui o <select> do HTML)                  */
/* ------------------------------------------------------------------ */
function Seletor({ rotulo, valor, opcoes, aoMudar, metade }) {
  const [aberto, setAberto] = useState(false);
  const atual = opcoes.find((o) => !o.grupo && o.valor === valor);

  return (
    <View style={[styles.campo, metade && styles.campoMetade]}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <Pressable style={styles.seletor} onPress={() => setAberto(true)}>
        <Text style={styles.seletorTexto} numberOfLines={1}>
          {atual ? atual.label : 'Selecione'}
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
                    <Text style={[styles.opcaoTexto, o.valor === valor && styles.opcaoTextoAtivo]}>
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
/* COMPONENTE: CAMPO DE TEXTO                                          */
/* ------------------------------------------------------------------ */
function Campo({ rotulo, metade, multilinha, linhas, ...resto }) {
  return (
    <View style={[styles.campo, metade && styles.campoMetade]}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.input, multilinha && { height: linhas * 26 + 28, textAlignVertical: 'top' }]}
        placeholderTextColor="#777777"
        multiline={multilinha}
        {...resto}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* TELA                                                                */
/* ------------------------------------------------------------------ */
export default function PublicarPlanta() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const largo = width >= 900;
  const duasColunas = width >= 640;

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estilo, setEstilo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [distribuicao, setDistribuicao] = useState('');
  const [destaques, setDestaques] = useState(DESTAQUES_INICIAIS);
  const [novoDestaque, setNovoDestaque] = useState('');
  const [quartos, setQuartos] = useState('');
  const [banheiros, setBanheiros] = useState('');
  const [garagem, setGaragem] = useState('');
  const [area, setArea] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState(null);

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const navegar = (rota) => router.push(rota);

  const adicionarDestaque = () => {
    const texto = novoDestaque.trim();
    if (!texto) return;
    const existe = destaques.some((d) => d.toLowerCase() === texto.toLowerCase());
    if (!existe) setDestaques((lista) => [...lista, texto]);
    setNovoDestaque('');
  };

  const removerDestaque = (texto) =>
    setDestaques((lista) => lista.filter((d) => d !== texto));

  const escolherImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!resultado.canceled) setImagem(resultado.assets[0]);
  };

  const publicar = () => {
    setSucesso(false);

    if (!titulo.trim()) return setErro('Informe o título da planta.');
    if (!descricao.trim()) return setErro('Informe a descrição.');
    if (!categoria) return setErro('Selecione a categoria.');
    if (!quartos || Number(quartos) < 1) return setErro('Informe a quantidade de quartos (mínimo 1).');
    if (!banheiros || Number(banheiros) < 1) return setErro('Informe a quantidade de banheiros (mínimo 1).');
    if (garagem === '') return setErro('Informe as vagas na garagem (pode ser 0).');
    if (!area) return setErro('Informe a área construída.');
    if (!preco) return setErro('Informe o preço.');
    if (!imagem) return setErro('Escolha a imagem da planta.');

    setErro('');

    const planta = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      estilo,
      categoria,
      distribuicao: distribuicao.trim(),
      destaques,
      quartos: Number(quartos),
      banheiros: Number(banheiros),
      garagem: Number(garagem),
      area: Number(area),
      preco: Number(preco.replace(/\./g, '').replace(',', '.')),
      imagem, // { uri, fileName, ... }
    };

    // TODO: enviar "planta" para o seu backend / banco de dados aqui.
    console.log('Planta pronta para publicar:', planta);

    setSucesso(true);
    setTitulo('');
    setDescricao('');
    setEstilo('');
    setCategoria('');
    setDistribuicao('');
    setDestaques(DESTAQUES_INICIAIS);
    setNovoDestaque('');
    setQuartos('');
    setBanheiros('');
    setGaragem('');
    setArea('');
    setPreco('');
    setImagem(null);
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

        {/* Formulário */}
        <View style={styles.pagina}>
          <View style={[styles.card, largo && styles.cardLargo]}>
            <Text style={[styles.titulo, !largo && styles.tituloEstreito]}>Publicar Nova Planta</Text>
            <Text style={styles.subtitulo}>
              Preencha as informações abaixo para cadastrar uma nova planta.
            </Text>
            <View style={styles.divisor} />

            <View style={styles.grid}>
              <Campo
                rotulo="Título da Planta"
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ex.: Casa Moderna com 3 Quartos"
              />

              <Campo
                rotulo="Descrição"
                multilinha
                linhas={6}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva sua planta..."
              />

              <Seletor
                rotulo="Estilo da Planta"
                valor={estilo}
                opcoes={OPCOES_ESTILO}
                aoMudar={setEstilo}
                metade={duasColunas}
              />
              <Seletor
                rotulo="Categoria"
                valor={categoria}
                opcoes={OPCOES_CATEGORIA}
                aoMudar={setCategoria}
                metade={duasColunas}
              />

              <Campo
                rotulo="Distribuição dos Ambientes"
                multilinha
                linhas={3}
                value={distribuicao}
                onChangeText={setDistribuicao}
                placeholder="Ex.: Sala integrada com cozinha, suíte master com closet, área gourmet..."
              />

              {/* Destaques do projeto */}
              <View style={styles.destaquesBox}>
                <Text style={styles.legenda}>Destaques do Projeto</Text>

                <View style={styles.chips}>
                  {destaques.map((d) => (
                    <View key={d} style={styles.chip}>
                      <Text style={styles.chipTexto}>{d}</Text>
                      <Pressable onPress={() => removerDestaque(d)} hitSlop={8}>
                        <Ionicons name="close" size={14} color={DOURADO} />
                      </Pressable>
                    </View>
                  ))}
                </View>

                <View style={styles.adicionar}>
                  <TextInput
                    style={[styles.input, styles.adicionarInput]}
                    placeholderTextColor="#777777"
                    placeholder="Digite um diferencial e pressione Enter (ex.: Energia solar)"
                    value={novoDestaque}
                    onChangeText={setNovoDestaque}
                    onSubmitEditing={adicionarDestaque}
                    returnKeyType="done"
                  />
                  <Pressable style={styles.btnAdicionar} onPress={adicionarDestaque}>
                    <Text style={styles.btnAdicionarTexto}>Adicionar</Text>
                  </Pressable>
                </View>
              </View>

              <Campo
                rotulo="Quantidade de Quartos"
                metade={duasColunas}
                value={quartos}
                onChangeText={(t) => setQuartos(soNumeros(t))}
                keyboardType="numeric"
                placeholder="Ex.: 3 quartos"
              />
              <Campo
                rotulo="Quantidade de Banheiros"
                metade={duasColunas}
                value={banheiros}
                onChangeText={(t) => setBanheiros(soNumeros(t))}
                keyboardType="numeric"
                placeholder="Ex.: 2 banheiros"
              />
              <Campo
                rotulo="Vagas na Garagem"
                metade={duasColunas}
                value={garagem}
                onChangeText={(t) => setGaragem(soNumeros(t))}
                keyboardType="numeric"
                placeholder="Ex.: 2 vagas"
              />
              <Campo
                rotulo="Área Construída (m²)"
                metade={duasColunas}
                value={area}
                onChangeText={(t) => setArea(soNumeros(t))}
                keyboardType="numeric"
                placeholder="Ex.: 120 m²"
              />
              <Campo
                rotulo="Preço (R$)"
                metade={duasColunas}
                value={preco}
                onChangeText={(t) => setPreco(numeroDecimal(t))}
                keyboardType="decimal-pad"
                placeholder="Ex.: R$ 350.000,00"
              />

              {/* Imagem */}
              <View style={[styles.campo, duasColunas && styles.campoMetade]}>
                <Text style={styles.rotulo}>Imagem da Planta</Text>
                <View style={styles.arquivo}>
                  <Pressable style={styles.btnArquivo} onPress={escolherImagem}>
                    <Text style={styles.btnArquivoTexto}>Escolher arquivo</Text>
                  </Pressable>
                  {imagem ? (
                    <View style={styles.arquivoEscolhido}>
                      <Image source={{ uri: imagem.uri }} style={styles.miniatura} />
                      <Text style={styles.arquivoTexto} numberOfLines={1}>
                        {imagem.fileName || 'Imagem selecionada'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.arquivoTexto}>Nenhum arquivo escolhido</Text>
                  )}
                </View>
              </View>
            </View>

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
            {sucesso && (
              <Text style={styles.sucesso}>Planta publicada com sucesso!</Text>
            )}

            <Pressable style={styles.btnPublicar} onPress={publicar}>
              <Text style={styles.btnPublicarTexto}>Publicar Planta</Text>
            </Pressable>
          </View>
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

  fundoImagem: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fundoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.4)' },

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

  // Página
  pagina: { width: '100%', paddingHorizontal: 16, paddingTop: 26, paddingBottom: 50 },

  card: {
    width: '100%',
    maxWidth: 950,
    alignSelf: 'center',
    backgroundColor: 'rgba(14, 14, 14, 0.95)',
    borderWidth: 1,
    borderColor: '#3a3020',
    borderRadius: 22,
    padding: 22,
  },
  cardLargo: { padding: 34 },

  titulo: { color: '#ffffff', fontSize: 32, fontWeight: '800' },
  tituloEstreito: { fontSize: 26 },
  subtitulo: { color: '#d0d0d0', fontSize: 14, marginTop: 14 },
  divisor: { height: 1, backgroundColor: '#3a3a3a', marginTop: 16, marginBottom: 22 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 24, rowGap: 22 },
  campo: { width: '100%' },
  campoMetade: { width: '48.4%' },
  rotulo: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginBottom: 10 },

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

  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#2c2c2c',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
  },
  seletorTexto: { color: '#ffffff', fontSize: 14, flex: 1, marginRight: 8 },

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

  // Destaques
  destaquesBox: {
    width: '100%',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#3a3020',
    borderRadius: 12,
    paddingTop: 22,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  legenda: {
    position: 'absolute',
    top: -12,
    left: 16,
    backgroundColor: '#0e0e0e',
    paddingHorizontal: 8,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1c1a14',
    borderWidth: 1,
    borderColor: '#4a3f26',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipTexto: { color: '#ffffff', fontSize: 13 },
  adicionar: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  adicionarInput: { flex: 1, minWidth: 200 },
  btnAdicionar: {
    borderWidth: 1,
    borderColor: DOURADO,
    borderRadius: 8,
    height: 46,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAdicionarTexto: { color: DOURADO, fontWeight: 'bold', fontSize: 14 },

  // Arquivo
  arquivo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 62,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#101010',
    paddingHorizontal: 12,
  },
  btnArquivo: {
    borderWidth: 1,
    borderColor: DOURADO,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  btnArquivoTexto: { color: DOURADO, fontWeight: 'bold', fontSize: 13 },
  arquivoEscolhido: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  miniatura: { width: 34, height: 34, borderRadius: 4 },
  arquivoTexto: { color: '#ffffff', fontSize: 13, flexShrink: 1 },

  // Mensagens e botão
  erro: { color: '#e57373', fontSize: 14, marginTop: 20 },
  sucesso: { color: '#8fd19e', fontSize: 14, fontWeight: 'bold', marginTop: 20 },
  btnPublicar: {
    marginTop: 24,
    backgroundColor: DOURADO_BOTAO,
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DOURADO_BOTAO,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  btnPublicarTexto: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 15 },

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