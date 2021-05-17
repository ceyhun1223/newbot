const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const { Client, Util } = require('discord.js');
require('./util/eventLoader.js')(client);
const fs = require('fs');
const  db  = require('quick.db')


var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

///////////////////////eklendim atıldım

client.on('message', async (msg, member, guild) => {
    let i = await  db.fetch(`saas_${msg.guild.id}`)
        if(i === 'açık') {
          if (msg.content.toLowerCase() === 'sa') {
          msg.reply('Aleyküm Selam Hoşgeldin');      
        } 
        }
      });







      client.on('guildCreate', guild => {
      
        let Crewembed = new Discord.MessageEmbed()
        
        .setColor("GREEN")
        .setTitle("EKLENDİM !")
        .addField("Sunucu Adı:", guild.name)
        .addField("Sunucu sahibi", guild.owner)
        .addField("Sunucudaki Kişi Sayısı:", guild.memberCount)
        
           client.channels.cache.get('839909539485581322').send(Crewembed);
          
        });
  client.on('guildDelete', guild => {
  
      let Crewembed = new Discord.MessageEmbed()
      
      .setColor("RED")
      .setTitle(" ATILDIM !")
      .addField("Sunucu Adı:", guild.name)
      .addField("Sunucu sahibi", guild.owner)
      .addField("Sunucudaki Kişi Sayısı:", guild.memberCount)
      
         client.channels.cache.get('839909539485581322').send(Crewembed);
        
      });












client.login(ayarlar.token);


//küfür-engel 
client.on('message', async msg => {
  const Database = require("plasma-db");
  const db = new Database("./database.json");
  let engin = db.fetch(`küfürengellog_${msg.guild.id}`)
  let enginn = db.fetch(`küfürengelmesaj_${msg.guild.id}`)
  let enginar = db.fetch(`küfürengel_${msg.guild.id}`)
  if(enginar === "aktif") {
  const kufurler = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "sik", "yarrak", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "amq",];
  if (kufurler.some(word => msg.content.includes(word))) {
    try {
      if (!msg.member.hasPermission("BAN_MEMBERS")) {
            msg.delete();
            const embed = new Discord.MessageEmbed()
            .setTitle('Bir küfür yakaladım!')
            .setDescription(`<@${msg.author.id}> adlı kullanıcı küfürlü kelime kullandı! \n Kullanıcının ettiği küfür silindi!`)
            client.channels.cache.get(engin).send(embed)
            return msg.channel.send(`<@${msg.author.id}>, ${enginn}`)
   
          }              
        } 
        catch(err) {
          console.log(err);
        }
  }
  }
  else return;
  });












    client.on("messageDelete", async message => {
      if (message.author.bot || message.channel.type == "dm") return;
    
      let log = message.guild.channels.cache.get(
        await db.fetch(`log.${message.guild.id}`)
      );
    
      if (!log) return;
    
      const embed = new Discord.MessageEmbed()
    
        .setTitle(message.author.username + " | Mesaj Silindi")
    
        .addField("Kullanıcı: ", message.author)
    
        .addField("Kanal: ", message.channel)
    
        .addField("Mesaj: ", "" + message.content + "");
    
      log.send(embed);
    });
    
    client.on("messageUpdate", async (oldMessage, newMessage) => {
      let modlog = await db.fetch(`log.${oldMessage.guild.id}`);
    
      if (!modlog) return;
    
      let embed = new Discord.MessageEmbed()
    
        .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL())
    
        .addField("**Eylem**", "Mesaj Düzenleme")
    
        .addField(
          "**Mesajın sahibi**",
          `<@${oldMessage.author.id}> === **${oldMessage.author.id}**`
        )
    
        .addField("**Eski Mesajı**", `${oldMessage.content}`)
    
        .addField("**Yeni Mesajı**", `${newMessage.content}`)
    
        .setTimestamp()
    
        .setColor("RANDOM")
    
        .setFooter(
          `Sunucu: ${oldMessage.guild.name} - ${oldMessage.guild.id}`,
          oldMessage.guild.iconURL()
        )
    
        .setThumbnail(oldMessage.guild.iconURL);
    
      client.channels.cache.get(modlog).send(embed);
    });
    
    client.on("channelCreate", async channel => {
      if(!channel.guild) return
      let modlog = await db.fetch(`log.${channel.guild.id}`);
    
      if (!modlog) return;
    
      const entry = await channel.guild
        .fetchAuditLogs({ type: "CHANNEL_CREATE" })
        .then(audit => audit.entries.first());
    
      let kanal;
    
      if (channel.type === "text") kanal = `<#${channel.id}>`;
    
      if (channel.type === "voice") kanal = `\`${channel.name}\``;
    
      let embed = new Discord.MessageEmbed()
    
        .setAuthor(entry.executor.username, entry.executor.avatarURL())
    
        .addField("**Eylem**", "Kanal Oluşturma")
    
        .addField("**Kanalı Oluşturan Kişi**", `<@${entry.executor.id}>`)
    
        .addField("**Oluşturduğu Kanal**", `${kanal}`)
    
        .setTimestamp()
    
        .setColor("RANDOM")
    
        .setFooter(
          `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
          channel.guild.iconURL()
        )
    
        .setThumbnail(channel.guild.iconUR);
    
      client.channels.cache.get(modlog).send(embed);
    });
    
    client.on("channelDelete", async channel => {
      let modlog = await db.fetch(`log.${channel.guild.id}`);
    
      if (!modlog) return;
    
      const entry = await channel.guild
        .fetchAuditLogs({ type: "CHANNEL_DELETE" })
        .then(audit => audit.entries.first());
    
      let embed = new Discord.MessageEmbed()
    
        .setAuthor(entry.executor.username, entry.executor.avatarURL())
    
        .addField("**Eylem**", "Kanal Silme")
    
        .addField("**Kanalı Silen Kişi**", `<@${entry.executor.id}>`)
    
        .addField("**Silinen Kanal**", `\`${channel.name}\``)
    
        .setTimestamp()
    
        .setColor("RANDOM")
    
        .setFooter(
          `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
          channel.guild.iconURL()
        )
    
        .setThumbnail(channel.guild.iconURL);
    
      client.channels.cache.get(modlog).send(embed);
    });
    
    client.on("roleCreate", async role => {
      let modlog = await db.fetch(`log.${role.guild.id}`);
    
      if (!modlog) return;
    
      const entry = await role.guild
        .fetchAuditLogs({ type: "ROLE_CREATE" })
        .then(audit => audit.entries.first());
    
      let embed = new Discord.MessageEmbed()
    
        .setAuthor(entry.executor.username, entry.executor.avatarURL())
    
        .addField("**Eylem**", "Rol Oluşturma")
    
        .addField("**Rolü oluşturan kişi**", `<@${entry.executor.id}>`)
    
        .addField("**Oluşturulan rol**", `\`${role.name}\` **=** \`${role.id}\``)
    
        .setTimestamp()
    
        .setFooter(
          `Sunucu: ${role.guild.name} - ${role.guild.id}`,
          role.guild.iconURL
        )
    
        .setColor("RANDOM")
    
        .setThumbnail(role.guild.iconURL);
    
      client.channels.cache.get(modlog).send(embed);
    });
    
    client.on("roleDelete", async role => {
      let modlog = await db.fetch(`log.${role.guild.id}`);
    
      if (!modlog) return;
    
      const entry = await role.guild
        .fetchAuditLogs({ type: "ROLE_DELETE" })
        .then(audit => audit.entries.first());
    
      let embed = new Discord.MessageEmbed()
    
        .setAuthor(entry.executor.username, entry.executor.avatarURL())
    
        .addField("**Eylem**", "Rol Silme")
    
        .addField("**Rolü silen kişi**", `<@${entry.executor.id}>`)
    
        .addField("**Silinen rol**", `\`${role.name}\` **=** \`${role.id}\``)
    
        .setTimestamp()
    
        .setFooter(
          `Sunucu: ${role.guild.name} - ${role.guild.id}`,
          role.guild.iconURL
        )
    
        .setColor("RANDOM")
    
        .setThumbnail(role.guild.iconURL);
    
      client.channels.cache.get(modlog).send(embed);
    });
    
    client.on("emojiCreate", async emoji => {
      let modlog = await db.fetch(`log.${emoji.guild.id}`);
    
      if (!modlog) return;
    
      const entry = await emoji.guild
        .fetchAuditLogs({ type: "EMOJI_CREATE" })
        .then(audit => audit.entries.first());
    
      let embed = new Discord.MessageEmbed()
    
        .setAuthor(entry.executor.username, entry.executor.avatarURL())
    
        .addField("**Eylem**", "Emoji Oluşturma")
    
        .addField("**Emojiyi oluşturan kişi**", `<@${entry.executor.id}>`)
    
        .addField("**Oluşturulan emoji**", `${emoji} - İsmi: \`${emoji.name}\``)
    
        .setTimestamp()
    
        .setColor("RANDOM")
    
        .setFooter(
          `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
          emoji.guild.iconURL
        )
    
        .setThumbnail(emoji.guild.iconURL);
    
      client.channels.cache.get(modlog).send(embed);
    });
    
    client.on("emojiDelete", async emoji => {
      let modlog = await db.fetch(`log.${emoji.guild.id}`);
    
      if (!modlog) return;
    
      const entry = await emoji.guild
        .fetchAuditLogs({ type: "EMOJI_DELETE" })
        .then(audit => audit.entries.first());
    
      let embed = new Discord.MessageEmbed()
    
        .setAuthor(entry.executor.username, entry.executor.avatarURL())
    
        .addField("**Eylem**", "Emoji Silme")
    
        .addField("**Emojiyi silen kişi**", `<@${entry.executor.id}>`)
    
        .addField("**Silinen emoji**", `${emoji}`)
    
        .setTimestamp()
    
        .setFooter(
          `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
          emoji.guild.iconURL
        )
    
        .setColor("RANDOM")
    
        .setThumbnail(emoji.guild.iconURL);
    
      client.channels.cache.get(modlog).send(embed);
    });
    
    client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
      let modlog = await db.fetch(`log.${oldEmoji.guild.id}`);
    
      if (!modlog) return;
    
      const entry = await oldEmoji.guild
        .fetchAuditLogs({ type: "EMOJI_UPDATE" })
        .then(audit => audit.entries.first());
    
      let embed = new Discord.MessageEmbed()
    
        .setAuthor(entry.executor.username, entry.executor.avatarURL())
    
        .addField("**Eylem**", "Emoji Güncelleme")
    
        .addField("**Emojiyi güncelleyen kişi**", `<@${entry.executor.id}>`)
    
        .addField(
          "**Güncellenmeden önceki emoji**",
          `${oldEmoji} - İsmi: \`${oldEmoji.name}\``
        )
    
        .addField(
          "**Güncellendikten sonraki emoji**",
          `${newEmoji} - İsmi: \`${newEmoji.name}\``
        )
    
        .setTimestamp()
    
        .setColor("RANDOM")
    
        .setFooter(
          `Sunucu: ${oldEmoji.guild.name} - ${oldEmoji.guild.id}`,
          oldEmoji.guild.iconURL
        )
    
        .setThumbnail(oldEmoji.guild.iconURL);
    
      client.channels.cache.get(modlog).send(embed);
    });
    
    client.on("guildBanAdd", async (guild, user) => {
      let modlog = await db.fetch(`log.${guild.id}`);
    
      if (!modlog) return;
    
      const entry = await guild
        .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
        .then(audit => audit.entries.first());
    
      let embed = new Discord.MessageEmbed()
    
        .setAuthor(entry.executor.username, entry.executor.avatarURL())
    
        .addField("**Eylem**", "Yasaklama")
    
        .addField("**Kullanıcıyı yasaklayan yetkili**", `<@${entry.executor.id}>`)
    
        .addField("**Yasaklanan kullanıcı**", `**${user.tag}** - ${user.id}`)
    
        .addField("**Yasaklanma sebebi**", `${entry.reason}`)
    
        .setTimestamp()
    
        .setColor("RANDOM")
    
        .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)
    
        .setThumbnail(guild.iconURL);
    
      client.channels.cache.get(modlog).send(embed);
    });
    //
    client.on("guildBanRemove", async (guild, user) => {
      let modlog = await db.fetch(`log.${guild.id}`);
      if(!modlog) return;
    
      const entry = await guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" }).then(audit => audit.entries.first());
    
      let embed = new Discord.MessageEmbed()
      .setAuthor(entry.executor.username, entry.executor.avatarURL())
    
        .addField("**Eylem**", "Yasak kaldırma")
    
        .addField("**Yasağı kaldıran yetkili**", `<@${entry.executor.id}>`)
    
        .addField("**Yasağı kaldırılan kullanıcı**", `**${user.tag}** - ${user.id}`)
    
        .setTimestamp()
    
        .setColor("RANDOM")
    
        .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)
    
        .setThumbnail(guild.iconURL);
    
      client.channels.cache.get(modlog).send(embed);
    });










    client.on("message", async message => {
      if(message.author.bot) return;
      var spl = message.content.split(" ");
      if(spl[0] === ".emoji-rol-ayarla") {
      var args = spl.slice(1);
      var msg, emoji, rol, ee = "";
      try {
        msg = await message.channel.messages.fetch(args[0])
        emoji = args[1]
        rol = message.guild.roles.cache.get(args[2]) || message.mentions.roles.first();
        await msg.react(emoji)
        if(!rol) throw new Error("Düzgün bir rol yaz")
      } catch(e) {
        if(!e) return;
        e = (""+e).split("Error:")[1]
        if(e.includes("Cannot read property") || e.includes("Invalid Form Body")) {
          message.channel.send(`Mesaj id hatalı!`)
        } else if(e.includes("Emoji")) {
          message.channel.send(` Girdiğiniz emoji mesaja eklenemiyor!`)
        } else if(e.includes("ROLÜ")) {
          message.channel.send(`Girdiğiniz rol geçersiz!`)
        }
        ee = e
      }
       if(ee) return;
       message.channel.send(`:white_check_mark: | Emoji rol, **${msg.content}** içerikli mesaja atandı!`)
       db.push(`tepkirol.${message.guild.id}`, {
         kanal: msg.channel.id,
         rol: rol.id,
         mesaj: msg.id,
         emoji: emoji
       })
      } else if(spl[0] === ".emoji-rol-log") {
        var args = spl.slice(1)
        var chan = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first()
        if(!chan) return message.channel.send(`:warning: | Kanal etiketle veya id gir`)
        db.set(`tepkirolkanal.${message.guild.id}`, chan.id)
        message.channel.send(":white_check_mark: | Tepkirol log kanalı "+ chan+ " olarak ayarlandı!")
      }
    })
  client.on("raw", async event => {
      if(event.t === "MESSAGE_REACTION_ADD") {
        var get = db.get(`tepkirol.${event.d.guild_id}`)
        if(!get) return;
        var rol = get.find(a => a.emoji === event.d.emoji.name && a.mesaj === event.d.message_id)
        if(!rol) return;
        rol = rol.rol
     
        var member = await client.guilds.cache.get(event.d.guild_id).members.fetch(event.d.user_id)
        member.roles.add(rol);
        var kanal = db.get(`tepkirolkanal.${event.d.guild_id}`)
        if(kanal) {
          var kanal = client.channels.cache.get(kanal)
          kanal.send(  member  + " kullanıcısına, **" + kanal.guild.roles.cache.get(rol).name + "** adlı rol verildi! ")
        }
      } else if(event.t === "MESSAGE_REACTION_REMOVE") {
        var get = db.get(`tepkirol.${event.d.guild_id}`)
        if(!get) return;
        var rol = get.find(a => a.emoji === event.d.emoji.name && a.mesaj === event.d.message_id)
        if(!rol) return;
        rol = rol.rol
        var member = await client.guilds.cache.get(event.d.guild_id).members.fetch(event.d.user_id)
        member.roles.remove(rol);
        var kanal = db.get(`tepkirolkanal.${event.d.guild_id}`)
        if(kanal) {
          var kanal = client.channels.cache.get(kanal)
          kanal.send(member + " kullanıcısından, **" + kanal.guild.roles.cache.get(rol).name + "** adlı rol alındı!")
        }
      }
    })










