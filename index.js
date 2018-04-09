const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const cpu = process.cpuUsage().system / 1024 / 1024;
const used = process.memoryUsage().heapUsed / 1024 / 1024;

const bot = new Discord.Client({disableEveryone: false});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);

    function randomStatus() {
          let status = [`Normal Mode!`, `i!invite`, `i!help`,`Tommorow Fixed Ban And Kick!`, `${bot.guilds.size} Servers In The Your Party!`]
          let rstatus = Math.floor(Math.random() * status.length);
          bot.user.setActivity(status[rstatus], {type: 'Playing'});
  
     }; setInterval(randomStatus, 10000)
   
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    
    
    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}kick`){
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) return message.channel.send(":warning: **| Please Tag Player To Be Kicked!**");
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No can do pal!");
        if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":negative_squared_cross_mark: **| Failed To Kicked This Person!**");
      
        let kickEmbed = new Discord.RichEmbed()
        .setDescription("**KICKED**")
        .setColor("#f80a0a")
        .addField(":bust_in_silhouette: | Player Kicked", `**${kUser} | ID ${kUser.id}**`)
        .addField(":bust_in_silhouette: | Kicked By", `**<@${message.author.id}> | ID ${message.author.id}**`)
        .addField(":no_entry: | Reason", kReason);
      
        let kickChannel = message.guild.channels.find(`name`, "mod-log");
        if(!kickChannel) return message.channel.send("No Named Channel `mod-log`.");
      
        message.guild.member(kUser).kick(kReason);
        
        message.delete().catch(O_o=>{});
        message.channel.send(":white_check_mark:  | **Succes Kicked Players**")
        kickChannel.send(kickEmbed);
      
        return;
    }

    if(cmd === `${prefix}ban`){
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send(":warning: **| Please Tag Player To Be Banned!**");
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("No can do pal!");
        if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":negative_squared_cross_mark: **| Failed To Banned This Person!**");
    
        let banEmbed = new Discord.RichEmbed()
        .setDescription("**BANNED**")
        .setColor("#f80a0a")
        .addField(":bust_in_silhouette: | Player Banned", `**${bUser} | ID ${bUser.id}**`)
        .addField(":bust_in_silhouette: | Banned By", `**<@${message.author.id}> | ID ${message.author.id}**`)
        .addField(":no_entry: | Reason", bReason);
    
    
        let modlogchannel = message.guild.channels.find(`name`, "mod-log");
        if(!modlogchannel) return message.channel.send("No Named Channel `mod-log`.");
    
        message.guild.member(bUser).ban(bReason);
        
        message.delete().catch(O_o=>{});
        message.channel.send(":white_check_mark:  | **Succes Banned Players**")
        modlogchannel.send(banEmbed);
    
    
        return; 
    
    }
    
    if(cmd === `${prefix}help`){
        let helpembed = new Discord.RichEmbed()
        .setColor("#15f153")
        .setDescription("**Prefix : `i!`**")
        .addField(":lock: Moderators Command!", "| `i!ban [Player] [Reason]` | `i!kick [Player] [Reason]` | `i!tempmute [Player] [Time]` |\n| `i!say [say]` | `i!purge [Number]` | `i!news [news]` |\n| `i!warn [*Comming Soon*]` | `i!addrole [Player] [Role Name]` | `i!removerole help` | `i!createrole [Role Name]` |")
        .addField(":earth_asia: General Command", "| `i!ping` |\n| `i!afk [Reason]` | `i!help` | `i!ikan [question]` |\n| `i!userinfo [User]` | `!stats` | `!weather [Location]` |\n| `i!invite` |")
        .setFooter("Beta v0.2 | Discord.js");
        message.delete().catch(O_o=>{});
        message.channel.send(":mailbox_with_mail: **Sending Help To Your DM!**")
        return message.author.send(helpembed);           
    
    }

    if(cmd === `${prefix}tempmute`){
        let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tomute) return message.reply(":bust_in_silhouette: | No Player Wants You Mute!");
        if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply(":negative_squared_cross_mark: | Cant Mute Them!");
        let muterole = message.guild.roles.find(`name`, "muted");
        //start of create role
        if(!muterole){
          try{
            muterole = await message.guild.createRole({
              name: "muted",
              color: "#000000",
              permissions:[]
            })
            message.guild.channels.forEach(async (channel, id) => {
              await channel.overwritePermissions(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
              });
            });
          }catch(e){
            console.log(e.stack);
          }
        }
        //end of create role
        let mutetime = args[1];
        if(!mutetime) return message.reply("You didn't specify a time!");
      
        await(tomute.addRole(muterole.id));
        message.reply(`:white_check_mark: | <@${tomute.id}> Has Been Muted For ${ms(ms(mutetime))}`);
      
        setTimeout(function(){
          tomute.removeRole(muterole.id);
          message.channel.send(`:hourglass_flowing_sand: | <@${tomute.id}> Has Been Unmuted!`);
        }, ms(mutetime));
    
    }

    if(cmd === `${prefix}purge`){
        message.delete()
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, you don't have a permissions to do this!");
        if(!args[0]) return message.channel.send("Please Give The Number");
        message.channel.bulkDelete(args[0]).then(() => {
          message.channel.send(`🗑 | ${message.author} Succed Cleared ${args[0]} messages.`).then(msg => msg.delete(999999));
    
          let bicon = bot.user.displayAvatarURL;
          let purgemod = new Discord.RichEmbed()
          .setAuthor("Log | Purge", `https://images-ext-1.discordapp.net/external/fthmtHB4VcjVNH0P_yelzxnIj208kreL34GdDZOwxBU/https/qph.ec.quoracdn.net/main-qimg-83c6de25ed91d13a4f09fb5f11ca8853`)
          .setColor("#414c56")
          .addField("Executor:", `${message.author}`, true)
          .addField("Purge:", `${args[0]}`, true)
          .setFooter("WARNING!: This bot it still on beta testing. If you have any issue or suggestion please dm Afif");
    
          let modlog = message.guild.channels.find(`name`, "mod-log");
          if(!modlog) return message.channel.send("Can't Find mod-log channel.");
    
          modlog.send(purgemod);
    
    
        })
    }

    if(cmd === `${prefix}userinfo`){
        const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
        let embed = new Discord.RichEmbed()
        .setDescription("**USER INFO**")
        .setColor("#00a6ff")
        .setImage(member.user.displayAvatarURL)
        .addField(":bust_in_silhouette: | Player", `${member.user.tag}`)
        .addField(":shield: | ID", member.id)
        .addField(":hammer: | Created", member.user.createdAt)
        .addField(":inbox_tray: | Joined", member.joinedAt);
    
        message.channel.send(embed);
    
    }

    if(cmd === `${prefix}addrole`){
        if (!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
        if (args[0] == "help") {
          message.reply(":warning: | \nUsage: !addrole [user] [role]");
          return;
        }
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if (!rMember) return errors.cantfindUser(message.channel);
        let role = args.join(" ").slice(22);
        if (!role) return message.reply(":bust_in_silhouette: | Specify a role!");
        let gRole = message.guild.roles.find(`name`, role);
        if (!gRole) return message.reply(":bust_in_silhouette: | Roles Not Found!");
      
        if (rMember.roles.has(gRole.id)) return message.reply("✅ | They Hlready Have That Role!");
        await (rMember.addRole(gRole.id));
      
        try {
          await rMember.send(`Congrats, You Have Been Given The Role ${gRole.name}`)
        } catch (e) {
          console.log(e.stack);
          message.channel.send(`:tada: | Congrats To <@${rMember.id}>, They Have Been Given The Role ${gRole.name}`)
        }
    }

    if(cmd === `${prefix}removerole`){
        if (!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
        if(args[0] == "help"){
          message.reply(":warning: | Usage: !removerole <user> <role>");
          return;
        }
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!rMember) return message.reply(":warning: | Couldn't Find That User, To.");
        let role = args.join(" ").slice(22);
        if(!role) return message.reply(":bust_in_silhouette: | Specify a role");
        let gRole = message.guild.roles.find(`name`, role);
        if(!gRole) return message.reply(":bust_in_silhouette: | Roles Not Found!");
      
        if(!rMember.roles.has(gRole.id)) return message.reply(":warning: | They Don't Have That Role!");
        await(rMember.removeRole(gRole.id));
      
        try{
          await rMember.send(`RIP, You Lost The ${gRole.name} Role!`)
        }catch(e){
          message.channel.send(`RIP To <@${rMember.id}>`)
        }
    }

    if(cmd === `${prefix}createrole`){
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(":warning: | You Do Not Have Permission To Create Roles!");
        const name = message.content.split(' ').slice(1).join(' ');
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("I do not have permission to create roles!");
        message.guild.createRole({
        name: `${name}`
        })
        message.channel.send(`:white_check_mark: | Created Role ${name}!`)
    }
    
    if(cmd === `${prefix}stats`){
        let uptimes = (Math.round(bot.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) + " seconds.\n"

        let testembed = new Discord.RichEmbed()
        .setDescription("**STATS**")
        .setColor("#00fa3d")
        .addField(":mag: | Total Server", `${bot.guilds.size} Servers!`)
        .addField(":satellite: | Total Channels", `${bot.channels.size} Channels!`)
        .addField(":busts_in_silhouette: | Total Users", `${bot.users.size.toLocaleString()} Users!`)
        .addField(":notebook_with_decorative_cover: | Library", "Discord.js")
        .addField(":bulb: | CPU Usage", `${Math.round(cpu * 100) / 100}%`, true)
        .addField(":clipboard: |\ Memory Usage", `${Math.round(used * 100) / 100} MB`)
        .addField(":hourglass_flowing_sand: | Uptime", uptimes)
        .setFooter("This Command Has Released")
    
        message.channel.send(testembed);
    
    }
    
    if(cmd === `${prefix}invite`){
        let embed = new Discord.RichEmbed()
        .setDescription("***INVITE***")
        .addField("**Invite To Yours Discord!**", "Link : https://discordapp.com/api/oauth2/authorize?client_id=429589443486416906&permissions=8&scope=bot")
        .setFooter("Cmd error? plase dm @Afif_#9369 now!")
        message.channel.send(embed)
    }

    if(cmd === `${prefix}say`){
        message.delete();
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
        let botmessage = args.join(" ");
        message.channel.send(botmessage);
    }

    if(cmd === `${prefix}ikan`){
        if(!args[2]) return message.reply("**Usage `!ikan <Question>`**");
        let replies = ["Yes", "No", "I Dont Know!", "Apa Yang Kamu Bilang?", "Sangat Benar", "Sangat Salah"];
    
        let result = Math.floor((Math.random() * replies.length));
        let question = args.slice(1).join(" ");
    
        let ballembed = new Discord.RichEmbed()
        .setColor("#8d09f1")
        .addField(":question: | Question", question)
        .addField(":envelope_with_arrow: | Answer", replies[result])
        .setFooter(`Question By ${message.author.tag} | Is Indonesian Langunge!`);
    
        message.channel.send(ballembed)
    
    }

}); 

bot.login(process.env.BOT_TOKEN);