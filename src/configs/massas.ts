import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export const usuariosCadastro: Record<string, CredenciaisLogin> = {
    usuarioEmailExistente: {
        email: 'brenogrammeudo-5454@yopmail.com',
        senha: 'senha@123',
        numero: '61999456436'
    },
    usuarioNumeroTelefoneExistente: {
        email: 'higordagg@yopmail.com',
        senha: 'senha@123',
        numero: '61999456435'
    }
}

export const usuariosLogin: Record<string, CredenciaisLogin> = {
    login: {
        email: 'brenogrammeudo-5454@yopmail.com',
        senha: 'senha@123'
    },
    usuarioSenhaIncorreta: {
        email: 'brenogrammeudo-5454@yopmail.com',
        senha: 'senhateste'
    }
}

export const usuarioDepositPix: CredenciaisLogin = {
    email: 'higor-pix@gmail.com',
    senha: 'senha@123'
}

export const usuarioPerfil: CredenciaisLogin = {
    email: 'higor-6553@gmail.com',
    senha: 'senha@123'
}

export const usuarioCryptomoedas: CredenciaisLogin = {
    email: 'higorapp@gmail.com',
    senha: 'senha@123'
}

export const usuarioInfluencer: CredenciaisLogin = {
    email: 'ingrid.bsousa100@yopmail.com',
    senha: 'senha@123'
}

export const usuarioChile: CredenciaisLogin = {
    email: 'higorchile123@gmail.com',
    senha: 'senha@123'
}

export const usuarioMexico: CredenciaisLogin = {
    email: 'higor-mm@gmail.com',
    senha: 'senha@123'
}

export const usuarioColombia: CredenciaisLogin = {
    email: 'higtobh@yahoo.com',
    senha: 'senha@123'
}