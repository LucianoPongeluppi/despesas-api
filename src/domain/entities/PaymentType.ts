type PaymentTypeProps = {
  id?: string | null;
  tipo: string;
};

export class PaymentType {
  public readonly id?: string | null;
  public readonly tipo: string;

  constructor(props: PaymentTypeProps) {
    this.id = props.id ?? null;
    this.tipo = props.tipo;
  }
}
