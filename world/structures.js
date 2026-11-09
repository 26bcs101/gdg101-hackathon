
  buildWelcome(0, 12);
  buildTracks(-16, 0);
  buildSchedule(16, 0);
  buildPrizes(0, -10);
  buildSponsors(0, -18);
  buildTeam(-14, -14);
  buildFaq(-20, -2);
  buildVenue(-15, 8);
  buildRegister(8, 22);

  return {
    batches: { static: B },
    planes,
    obstacles,
    hotspots,
    bakes,
  };
}
