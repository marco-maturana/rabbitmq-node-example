const amqp = require('amqplib');

const msg = 'Hello World!';

async function init () {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()

  const assetQueue = await channel.assertQueue('', { exclusive: true });
  // await channel.bindQueue(assetQueue.queue, 'logs', '')

  channel.sendToQueue('task_queue', Buffer.from(msg), { replyTo: assetQueue.queue });
  console.log(" [x] Sent '%s'", msg);

  channel.consume(assetQueue.queue, (msg) => {
    console.log("[x] Received log  '%s'", msg.content.toString());
  }, {noAck: true});
}

init()