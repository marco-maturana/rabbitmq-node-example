const amqp = require('amqplib');

async function init () {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()

  await channel.assertQueue('task_queue', { durable: true });

  await channel.prefetch(1)

  await channel.assertExchange('logs', 'fanout', {durable: false})

  channel.consume('task_queue', (msg) => {
    const body = msg.content.toString();
    console.log(" [x] Received '%s'", body);

    setTimeout(() => {
      console.log(" [x] Done");

      const message = 'new log'

      channel.publish('logs', '', Buffer.from(message));
      console.log(" [x] Sent log '%s'", message);

      channel.ack(msg);
    }, 1000);
  }, { noAck: false });


  console.log(" [*] Waiting for messages. To exit press CTRL+C");
}

init()