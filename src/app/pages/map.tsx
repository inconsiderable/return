import { PageShell } from '../components/pageShell';
import { useHeart } from '../useCases/useHeart';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../utils/appContext';
import FocalMap from '../components/mapGraph';
import { parseGraphDOT } from '../utils/compat';

const Map = () => {
  const { selectedKey } = useHeart();

  const {
    colorScheme,
    tipHeader,
    graphDOT,
    requestGraphDOT,
    rankingFilter,
    setRankingFilter,
  } = useContext(AppContext);

  const tipHeight = tipHeader?.header.height ?? 0;

  const [peekGraphKey, setPeekGraphKey] = useState<string | null | undefined>();

  const whichKey =
    peekGraphKey ||
    selectedKey ||
    '0000000000000000000000000000000000000000000=';

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (whichKey) {
        requestGraphDOT(whichKey);
      }
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [whichKey, requestGraphDOT]);

  useEffect(() => {
    const resultHandler = (data: any) => {
      if (whichKey && data.detail) {
        requestGraphDOT(whichKey);
      }
    };

    document.addEventListener('inv_pass', resultHandler);

    return () => {
      document.removeEventListener('inv_pass', resultHandler);
    };
  }, [whichKey, requestGraphDOT]);

  const gdot = graphDOT(whichKey);

  const { nodes, links } = parseGraphDOT(gdot, whichKey, rankingFilter);

  return (
    <PageShell
      renderBody={() => (
        <>
          {!!whichKey && (
            <>
              {!!gdot && (
                <FocalMap
                  tipHeight={tipHeight}
                  forKey={whichKey}
                  nodes={nodes ?? []}
                  links={links ?? []}
                  setForKey={setPeekGraphKey}
                  rankingFilter={rankingFilter}
                  setRankingFilter={setRankingFilter}
                  colorScheme={colorScheme}
                />
              )}
            </>
          )}
        </>
      )}
    />
  );
};

export default Map;
