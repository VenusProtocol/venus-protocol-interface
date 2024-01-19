import TEST_VIP from 'assets/proposals/vip-123.json';

import importJsonProposal from '..';

describe('utilities/importJsonProposal', () => {
  it('should import a valid VIP file', async () => {
    const contents = JSON.stringify(TEST_VIP);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    const result = await importJsonProposal(jsonVip);
    expect(result.title).toBe(TEST_VIP.meta.title);
  });

  it('should throw an error if there is no meta key in the file', async () => {
    const withoutMeta: Partial<typeof TEST_VIP> = { ...TEST_VIP };
    delete withoutMeta.meta;
    const contents = JSON.stringify(withoutMeta);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there is no title in the metadata', async () => {
    const withoutTitle = { ...TEST_VIP, meta: { ...TEST_VIP.meta, title: '' } };
    const contents = JSON.stringify(withoutTitle);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there is no description in the metadata', async () => {
    const withoutDescription = { ...TEST_VIP, meta: { ...TEST_VIP.meta, description: '' } };
    const contents = JSON.stringify(withoutDescription);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there is no for description in the metadata', async () => {
    const withoutForDescription = { ...TEST_VIP, meta: { ...TEST_VIP.meta, forDescription: '' } };
    const contents = JSON.stringify(withoutForDescription);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there is no against description in the metadata', async () => {
    const withoutAgainstDescription = {
      ...TEST_VIP,
      meta: { ...TEST_VIP.meta, againstDescription: '' },
    };
    const contents = JSON.stringify(withoutAgainstDescription);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there is no abstain description in the metadata', async () => {
    const withoutAbstainDescription = {
      ...TEST_VIP,
      meta: { ...TEST_VIP.meta, abstainDescription: '' },
    };
    const contents = JSON.stringify(withoutAbstainDescription);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there are no call signatures', async () => {
    const withoutSignatures: Partial<typeof TEST_VIP> = { ...TEST_VIP };
    delete withoutSignatures.signatures;
    const contents = JSON.stringify(withoutSignatures);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there are no targets', async () => {
    const withoutTargets: Partial<typeof TEST_VIP> = { ...TEST_VIP };
    delete withoutTargets.targets;
    const contents = JSON.stringify(withoutTargets);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there are no params', async () => {
    const withoutParams: Partial<typeof TEST_VIP> = { ...TEST_VIP };
    delete withoutParams.params;
    const contents = JSON.stringify(withoutParams);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there is no proposal type', async () => {
    const withoutProposalType: Partial<typeof TEST_VIP> = { ...TEST_VIP };
    delete withoutProposalType.type;
    const contents = JSON.stringify(withoutProposalType);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there is a missing target entry for a signature', async () => {
    const mismatchTargetSignature = { ...TEST_VIP, targets: [...TEST_VIP.targets] };
    mismatchTargetSignature.targets.pop();
    const contents = JSON.stringify(mismatchTargetSignature);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if there is a missing param entry for a signature', async () => {
    const mismatchParamSignature = { ...TEST_VIP, params: [...TEST_VIP.params] };
    mismatchParamSignature.params.pop();
    const contents = JSON.stringify(mismatchParamSignature);
    const jsonVip = new File([contents], 'test', { type: 'application/json' });

    File.prototype.text = vi.fn().mockResolvedValueOnce(contents);
    expect(async () => {
      await importJsonProposal(jsonVip);
    }).rejects.toThrowErrorMatchingSnapshot();
  });
});
