type ExpenseProps = {
  id?: string | null;
  valor: number;
  data_compra: string;
  descricao: string;
  tipo_pagamento_id: string;
  categoria_id: string;
  estabelecimento_id?: string | null;
};

export class Expense {
  public readonly id?: string | null;
  public readonly valor: number;
  public readonly data_compra: string;
  public readonly descricao: string;
  public readonly tipo_pagamento_id: string;
  public readonly categoria_id: string;
  public readonly estabelecimento_id?: string | null;

  constructor(props: ExpenseProps) {
    this.id = props.id ?? null;
    this.valor = props.valor;
    this.data_compra = props.data_compra;
    this.descricao = props.descricao;
    this.tipo_pagamento_id = props.tipo_pagamento_id;
    this.categoria_id = props.categoria_id;
    this.estabelecimento_id = props.estabelecimento_id ?? null;
  }
}
