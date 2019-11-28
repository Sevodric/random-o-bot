/* === TODO ===
 * --- Features
 * 1. Whenever a guild member joins an audio channel, make the bot joins too,
 * waits a little, and screams
 * 2. Add parameters to randMoveMe to specify which guild member to move and how
 * many times -> new command
 * 4. Whenever nobody is talking in an audio channel for a long time, play
 * grasshopper sounds
 * 4. Add a help command
 * */

const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')

// Print out a message when the bot is ready
client.on('ready', () => {
  console.log('Random\'O\'Bot is ready!')
})

// Load the commands' prefix from the config file
const prefix = config.prefix

client.on('message', (message) => {
  // If the message doesn't start with the right prefix, or if it comes from a
  // bot, there is no need to go further
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return
  }

  /* rob!randMoveMe : move the message's author from the audio channel in
   * which he is currently connected to, to another randomly selected audio
   * channel */
  if (message.content.startsWith(`${prefix}randMoveMe`)) {
    // Get the guild from which the message was sent
    const guild = client.guilds.find(guild => guild.id === message.guild.id)

    // Get a random member among those currently connected to a voice channel
    const member = guild.members.filter(member => member.voiceChannel).random()

    // Get a random voice channel
    const voiceChannel = guild.channels.filter(channel => channel.type === 'voice').random()

    // Move selected member to selected channel
    member.setVoiceChannel(voiceChannel.id)
      .then(() => console.log(`Moved member ${member.id} to channel ${voiceChannel.id}`))
      .catch(console.error)
  }

  if (message.content.startsWith(prefix + 'test')) {
    // test function
  }
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
  // Execute the following code only when a guild member joins a channel
  if (newMember.voiceChannel) {
    // Get the voice channel the member is connected to
    const voiceChannel = newMember.voiceChannel

    // Join the voice channel
    voiceChannel.join()
      .then(connection => {
        // Wait for the connection to be ready => prevent the bot to leave before
        // the connection is ready
        connection.on('ready', () => {
          // Play the audio file and leave the channel as soon as it ends
          const dispatcher = connection.playFile('./audio/screaming_sheep.mp3')
          dispatcher.stream.on('end', () => {
            connection.disconnect()
            voiceChannel.leave()
          })
        })
      })
      .catch(console.error)
  }
})

client.login(config.token)
