import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {

    // constructor(private prisma: PrismaService){}
    
    // async findAll()
    // {
    //     return this.prisma.admin.findMany();
    // }

    // async create(data: any){
    //     return this.prisma.admin.create({ data });
    // }

    // async findByEmail(email: string)
    // {
    //     return this.prisma.admin.findUnique({where: {email},
    //         select:{
    //             id: true,
    //             name: true,
    //             email: true,
    //             password: true,
    //         }
    //     });
    // }

    // async dashboardStats() {

    //     const totalUsuarios = await this.prisma.student.count();

    //     const totalEstudantes = await this.prisma.student.count({
    //         where: { type: "estudante" }
    //     });

    //     const totalEmpresas = await this.prisma.company.count({
    //         where: { type: "empresa" }
    //     });

    //     const pendentes = await this.prisma.student.count({
    //         where: { state: "pendente" }
    //     });

    //     const aprovados = await this.prisma.student.count({
    //         where: { state: "aprovado" }
    //     });

    //     const rejeitados = await this.prisma.student.count({
    //         where: { state: "rejeitado" }
    //     });

    //     const bloqueados = await this.prisma.student.count({
    //         where: {  state: "rejeitado"  }
    //     });

    //     const empresaPendentes = await this.prisma.company.count({
    //         where: { state: "pendente" }
    //     });

    //     const empresaAprovados = await this.prisma.company.count({
    //         where: { state: "aprovado" }
    //     });

    //     const empresaRejeitados = await this.prisma.company.count({
    //         where: { state: "rejeitado" }
    //     });

    //     const empresaBloqueados = await this.prisma.company.count({
    //         where: {  state: "rejeitado"  }
    //     });

    //     const vagas = await this.prisma.vaga.count();

    //     return {
    //         totalUsuarios,
    //         totalEstudantes,
    //         totalEmpresas,
    //         pendentes,
    //         aprovados,
    //         rejeitados,
    //         bloqueados,
    //         vagas,
    //         empresaAprovados,
    //         empresaPendentes,
    //         empresaBloqueados,
    //         empresaRejeitados
    //     };
    // }
}
