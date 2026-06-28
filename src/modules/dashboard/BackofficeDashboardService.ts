import { EmpresasRepository } from "../empresas/repositories/EmpresasRepository";
import { AuthRepository } from "../users/repositories/AuthRepository";
import { ProcessoRepository } from "../processos/repositories/ProcessoRepository";
import { ClienteRepository } from "../clientes/repositories/ClienteRepository";
import { PeticaoRepository } from "../peticoes/repositories/PeticaoRepository";

export const BackofficeDashboardService = {
  async stats() {
    const [escritorios, usuarios, processos, clientes, peticoes] = await Promise.all([
      EmpresasRepository.count(),
      AuthRepository.count(),
      ProcessoRepository.count(),
      ClienteRepository.count(),
      PeticaoRepository.count(),
    ]);

    return { escritorios, usuarios, processos, clientes, peticoes };
  },
};
