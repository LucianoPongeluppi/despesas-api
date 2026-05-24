import { Address } from './Address';

type EstablishmentProps = {
  id?: string | null;
  endereco_id?: string | null;
  address?: Address | null;
};

export class Establishment {
  public readonly id?: string | null;
  public readonly endereco_id?: string | null;
  public readonly address?: Address | null;

  constructor(props: EstablishmentProps) {
    this.id = props.id ?? null;
    this.endereco_id = props.endereco_id ?? null;
    this.address = props.address ?? null;
  }
}
