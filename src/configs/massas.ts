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

export const usuarioFirstDeposit: CredenciaisLogin = {
    email: 'higorvhjyg@gmail.com',
    senha: '460.866.970-27'
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
    email: 'zetavares.rib+mexico@gmail.com',
    senha: 'Hb223640'
}

export const usuarioColombia: CredenciaisLogin = {
    email: 'higtobh@yahoo.com',
    senha: 'senha@123'
}