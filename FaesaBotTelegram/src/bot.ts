const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
import { PrismaClient } from '@prisma/client';

// Cria uma instância do cliente Prisma
const prisma = new PrismaClient();

// Horário de funcionamento
const horaAbertura = 9;
const horaFechamento = 17;

// Lista de IDs de bate-papo para os quais um email está sendo aguardado
const chatIdListEmailAguardado = [];

// Lista de IDs de bate-papo para os quais o email já foi registrado
const chatIdListEmailRegistrado = [];

// Token do Telegram
const telegramToken = process.env.TELEGRAM_API_KEY;

// Cria uma instância do bot Telegram
const bot = new TelegramBot(telegramToken, { polling: true });

// Configura o evento de mensagem recebida
bot.on('message', async (msg) => {
    const message = msg.text;
    const chatId = msg.chat.id;
    const date = new Date(msg.date * 1000);
    const hours = date.getHours();

    // Verifica se está fora do horário de funcionamento
    if (hours < horaAbertura || hours > horaFechamento) {
        // Verifica se o usuário já registrou seu email
        if (await verificarUsuarioRegistrado(chatId.toString())) {
            bot.sendMessage(chatId, `Fora do horário de funcionamento. (${horaAbertura}h às ${horaFechamento+1}h)\n\nSeu email já foi registrado, por favor, aguarde nosso retorno.`);
            return;
        }

        // Verifica se o usuário já está aguardando para registrar seu email
        if (chatIdListEmailAguardado.includes(chatId)) {
            cadastrarEmailBanco(message.toString(), chatId.toString());
            return;
        }

        // Primeiro contato - Solicita o email ao usuário
        bot.sendMessage(chatId, `Fora do horário de funcionamento. (${horaAbertura}h às ${horaFechamento+1}h)\n\nPor favor, informe seu endereço de email para entrarmos em contato.`);
        chatIdListEmailAguardado.push(chatId);
    } else {
        // Durante o horário de funcionamento - Envia uma mensagem padrão com o link
        bot.sendMessage(chatId, "https://faesa.br");
    }
    console.log("Hora: " + hours);
});

// Função para cadastrar o email no banco de dados
async function cadastrarEmailBanco(email, chatId) {
    // Adiciona o email à lista de emails registrados
    chatIdListEmailRegistrado.push(chatId);

    // Salva o email no banco de dados usando o Prisma
    await prisma.user.create({
        data: {
            chatId: chatId,
            email: email
        },
    });

    // Envia uma mensagem de confirmação para o usuário
    bot.sendMessage(chatId, `Email registrado com sucesso. Entraremos em contato em breve.`);
}

// Função para verificar se o usuário já registrou seu email
async function verificarUsuarioRegistrado(chatId) {
    // Consulta o banco de dados usando o Prisma para verificar se o email já está registrado
    const usuarios = await prisma.user.findMany({
        where: {
            chatId: chatId,
        },
    });

    // Retorna true se houver usuários encontrados, indicando que o email já foi registrado
    return usuarios.length > 0;
}

const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
import { PrismaClient } from '@prisma/client';

// Cria uma instância do cliente Prisma
const prisma = new PrismaClient();

// Horário de funcionamento
const horaAbertura = 9;
const horaFechamento = 17;

// Lista de IDs de bate-papo para os quais um email está sendo aguardado
const chatIdListEmailAguardado = [];

// Lista de IDs de bate-papo para os quais o email já foi registrado
const chatIdListEmailRegistrado = [];

// Token do Telegram
const telegramToken = process.env.TELEGRAM_API_KEY;

// Cria uma instância do bot Telegram
const bot = new TelegramBot(telegramToken, { polling: true });

// Configura o evento de mensagem recebida
bot.on('message', async (msg) => {
    const message = msg.text;
    const chatId = msg.chat.id;
    const date = new Date(msg.date * 1000);
    const hours = date.getHours();

    // Verifica se está fora do horário de funcionamento
    if (hours < horaAbertura || hours > horaFechamento) {
        // Verifica se o usuário já registrou seu email
        if (await verificarUsuarioRegistrado(chatId.toString())) {
            bot.sendMessage(chatId, `Fora do horário de funcionamento. (${horaAbertura}h às ${horaFechamento+1}h)\n\nSeu email já foi registrado, por favor, aguarde nosso retorno.`);
            return;
        }

        // Verifica se o usuário já está aguardando para registrar seu email
        if (chatIdListEmailAguardado.includes(chatId)) {
            cadastrarEmailBanco(message.toString(), chatId.toString());
            return;
        }

        // Primeiro contato - Solicita o email ao usuário
        bot.sendMessage(chatId, `Fora do horário de funcionamento. (${horaAbertura}h às ${horaFechamento+1}h)\n\nPor favor, informe seu endereço de email para entrarmos em contato.`);
        chatIdListEmailAguardado.push(chatId);
    } else {
        // Durante o horário de funcionamento - Envia uma mensagem padrão com o link
        bot.sendMessage(chatId, "https://faesa.br");
    }
    console.log("Hora: " + hours);
});

// Função para cadastrar o email no banco de dados
async function cadastrarEmailBanco(email, chatId) {
    // Adiciona o email à lista de emails registrados
    chatIdListEmailRegistrado.push(chatId);

    // Salva o email no banco de dados usando o Prisma
    await prisma.user.create({
        data: {
            chatId: chatId,
            email: email
        },
    });

    // Envia uma mensagem de confirmação para o usuário
    bot.sendMessage(chatId, `Email registrado com sucesso. Entraremos em contato em breve.`);
}

// Função para verificar se o usuário já registrou seu email
async function verificarUsuarioRegistrado(chatId) {
    // Consulta o banco de dados usando o Prisma para verificar se o email já está registrado
    const usuarios = await prisma.user.findMany({
        where: {
            chatId: chatId,
        },
    });

    // Retorna true se houver usuários encontrados, indicando que o email já foi registrado
    return usuarios.length > 0;
}

