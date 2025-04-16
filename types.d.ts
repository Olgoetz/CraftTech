interface ConfirmationsProps {
  dataPrivacy: boolean;
  dataProcessing: boolean;
}

type ProfileProps = {
  user: User;
  street?: string;
  zipCode?: string;
  city?: string;
  phone?: string;
  attestations?: Attestation[];
};
