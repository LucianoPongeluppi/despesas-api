type AddressProps = {
  id?: string | null;
  cep?: string | null;
  uf?: string | null;
  cidade?: string | null;
  bairro?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  enriched?: boolean;
  enrichment_attempts?: number;
};

export class Address {
  public readonly id?: string | null;
  public readonly cep?: string | null;
  public readonly uf?: string | null;
  public readonly cidade?: string | null;
  public readonly bairro?: string | null;
  public readonly logradouro?: string | null;
  public readonly numero?: string | null;
  public readonly enriched: boolean;
  public readonly enrichment_attempts: number;

  constructor(props: AddressProps) {
    this.id = props.id ?? null;
    this.cep = props.cep ?? null;
    this.uf = props.uf ?? null;
    this.cidade = props.cidade ?? null;
    this.bairro = props.bairro ?? null;
    this.logradouro = props.logradouro ?? null;
    this.numero = props.numero ?? null;
    this.enriched = props.enriched ?? false;
    this.enrichment_attempts = props.enrichment_attempts ?? 0;
  }
}
