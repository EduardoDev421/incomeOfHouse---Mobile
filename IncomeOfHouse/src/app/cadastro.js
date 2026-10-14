import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');

  const cadastrar = () => {
    if (!nome.trim() || !email.trim() || !senha || !confirmar) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não conferem.');
      return;
    }
    setErro('');
    // TODO: salvar o usuário no seu backend aqui
    router.push('/login');
  };

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.caixa}>
        <Text style={styles.titulo}>Crie sua Conta</Text>
        <Text style={styles.subtitulo}>
          Comece a planejar sua casa com a IncomeOfHouses
        </Text>

        <Text style={styles.rotulo}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome completo"
          placeholderTextColor="#999"
        />

        <Text style={styles.rotulo}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seuemail@exemplo.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.rotulo}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Mínimo de 6 caracteres"
          placeholderTextColor="#999"
          secureTextEntry
        />

        <Text style={styles.rotulo}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          value={confirmar}
          onChangeText={setConfirmar}
          placeholder="Repita a senha"
          placeholderTextColor="#999"
          secureTextEntry
        />

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <Pressable style={styles.botao} onPress={cadastrar}>
          <Text style={styles.textoBotao}>Criar conta</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/')}>
          <Text style={styles.voltar}>← Voltar ao início</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f5f7f4' },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  caixa: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#254b35' },
  subtitulo: { fontSize: 14, color: '#555', marginTop: 4, marginBottom: 20 },
  rotulo: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccd5cd',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 14,
    color: '#222',
  },
  erro: { color: '#c0392b', fontSize: 13, marginBottom: 10 },
  botao: {
    backgroundColor: '#397653',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  link: { color: '#397653', textAlign: 'center', marginTop: 18, fontSize: 14 },
  voltar: { color: '#555', textAlign: 'center', marginTop: 14, fontSize: 13 },
});