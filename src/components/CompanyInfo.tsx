import type { CompanyData } from '@/types';

export default function CompanyInfo({ companyData }: { companyData: CompanyData }) {
  return (
    <div className="rounded-[8px] border border-[#e9ecef] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <h2 className="text-lg font-semibold text-[#212529]">Company Information</h2>
      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#212529]">
        {companyData.company_info}
      </p>
    </div>
  );
}
