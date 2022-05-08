//Data structures
var registeredUsers = [];
var discordUsers = [];
var twitterAccounts = [];

//example registered user object saved in registeredUsers
var registeredUser = {
    id: '125125123',
    allowTrading: false,
    notifications: true,
    followedAccounts: new Map(),
    binanceApiKey: '51241234',
    binanceApiSecret: '5123123',
  }

export default{
    registeredUsers,
    discordUsers,
    twitterAccounts
}