import { useEffect, useState } from 'react';
export default function Toast({ toast }: {
    toast: {
        message: string;
        key: number;
    } | null;
}) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!toast)
            return;
        setVisible(true);
        const t = setTimeout(() => setVisible(false), 2400);
        return () => clearTimeout(t);
    }, [toast]);
    return <div role="status" aria-live="polite" className={'action-toast ' + (visible ? 'show' : '')}>
      <span className="toast-check">✓</span>
      {toast?.message}
    </div>;
}

