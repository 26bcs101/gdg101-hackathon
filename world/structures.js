
  buildWelcome(0, 12);
  buildTracks(-16, 0);
  buildSchedule(16, 0);
  buildPrizes(0, -10);

  return {
    batches: { static: B },
    planes,
    obstacles,
    hotspots,
    bakes,
  };
}
