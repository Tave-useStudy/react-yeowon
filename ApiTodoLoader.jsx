function ApiTodoLoader({ status, error, onLoad }) {
  const isLoading = status === 'loading';

  return (
    <section
      style={{
        marginBottom: '16px',
        padding: '14px',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <strong>외부 API 투두</strong>
          <p style={{ marginTop: '4px', fontSize: '14px' }}>
            JSONPlaceholder의 앞 10개 투두를 현재 목록에 병합합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onLoad}
          disabled={isLoading}
        >
          {isLoading ? '불러오는 중...' : 'API 투두 불러오기'}
        </button>
      </div>

      {isLoading && (
        <div
          role="status"
          style={{
            marginTop: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            className="loading-spinner"
            aria-hidden="true"
          />
          <span>데이터를 불러오는 중입니다...</span>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          style={{
            marginTop: '12px',
            padding: '10px',
            border: '1px solid #ef4444',
            borderRadius: '6px',
          }}
        >
          <p>❌ {error}</p>

          <button
            type="button"
            onClick={onLoad}
            style={{ marginTop: '8px' }}
          >
            재시도
          </button>
        </div>
      )}

      {status === 'success' && (
        <p
          style={{
            marginTop: '12px',
            fontSize: '14px',
          }}
        >
          ✅ API 데이터 불러오기가 완료되었습니다.
        </p>
      )}
    </section>
  );
}

export default ApiTodoLoader;
