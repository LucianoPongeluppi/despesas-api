type CategoryProps = {
  id?: string | null;
  nome: string;
  descricao: string;
};

export class Category {
  public readonly id?: string | null;
  public readonly nome: string;
  public readonly descricao: string;

  constructor(props: CategoryProps) {
    this.id = props.id ?? null;
    this.nome = props.nome;
    this.descricao = props.descricao;
  }
}
