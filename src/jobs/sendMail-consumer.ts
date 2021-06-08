import {
  OnQueueCompleted,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDTO } from 'src/create-user/create-user-dto';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDTO>) {
    const { data } = job;

    await this.mailerService.sendMail({
      to: data.email,
      from: 'welcome@mail.com.br',
      subject: 'Seja bem vindo(a)',
      text: `Olá ${data.name}, seu cadastro foi realizado com sucesso! Seja bem vindo(a)`,
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`On Completed ${job.name}`);
  }

  @OnQueueProgress()
  onQueueProgress(job: Job) {
    console.log(`On Progress ${job.name}`);
  }
}

export { SendMailConsumer };
