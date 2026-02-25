import { Award, ExternalLink } from "lucide-react";

interface CertificationsProps {
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issuerUrl: string | null;
    credentialId: string | null;
    credentialUrl: string | null;
    issueDate: string;
    expiryDate: string | null;
  }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export default function CertificationsSection({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Certifications</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400 shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cert.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {cert.issuerUrl ? <a href={cert.issuerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{cert.issuer}</a> : cert.issuer}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Issued {formatDate(cert.issueDate)}</p>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs mt-2 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                      <ExternalLink className="w-3 h-3" />Verify Credential
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}